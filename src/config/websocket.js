const { Server } = require('socket.io');
const messageController = require("../controllers/messageController");
const User = require("../models/user")
const call = require("../controllers/callController")
const userSocketMap = {}; // userId -> socket.id
const pendingMessages = {}; // userId -> [ { senderId, message } ]

const config_websoket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);

        socket.on('register', (userId) => {
            userSocketMap[userId] = socket.id;
            console.log(`✅ Registered user ${userId} với socket ${socket.id}`);

            // Nếu user có tin nhắn chờ, gửi ngay
            if (pendingMessages[userId]) {
                pendingMessages[userId].forEach(({ senderId, message }) => {
                    socket.emit('receive_message', { senderId, message });
                    console.log(`📥 Đã gửi tin nhắn chờ cho ${userId} từ ${senderId}`);
                });
                delete pendingMessages[userId]; // xoá sau khi gửi
            }
        });

        socket.on('private_message', async ({ senderId, receiverId, message }) => {
            const newMessage = await messageController.createMessage(senderId, receiverId, message);
            if (newMessage) {
                socket.emit("receive_message", newMessage)
            }
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', {
                    senderId,
                    message,
                });
                console.log(`📤 ${senderId} -> ${receiverId}: ${message}`);
            } else {
                // Người nhận chưa online → lưu vào pendingMessages
                if (!pendingMessages[receiverId]) {
                    pendingMessages[receiverId] = [];
                }
                pendingMessages[receiverId].push({ senderId, message });
                console.log(`📥 Lưu tin nhắn chờ: ${senderId} -> ${receiverId}`);
            }
        });

        socket.on('group_message', ({ senderId, receiverIds, message, groupName, groupAvatar }) => {
            // Lưu tin nhắn nhóm vào cơ sở dữ liệu
            const isGroup = true
            messageController.createMessage(senderId, receiverIds, message, isGroup, groupName, groupAvatar)
                .then((newMessage) => {
                    Conversation.findOneAndUpdate(
                        { name: groupName, participants: { $all: receiverIds } },
                        { $set: { lastMessage: newMessage._id } },
                        { new: true }
                    );

                    // Gửi tin nhắn cho tất cả thành viên nhóm
                    receiverIds.forEach((receiverId) => {
                        const receiverSocketId = userSocketMap[receiverId];
                        if (receiverSocketId) {
                            io.to(receiverSocketId).emit('receive_message', {
                                senderId,
                                message,
                            });
                            console.log(`📤 ${senderId} -> ${receiverId}: ${message}`);
                        } else {
                            // Lưu tin nhắn vào pendingMessages nếu người nhận chưa online
                            if (!pendingMessages[receiverId]) {
                                pendingMessages[receiverId] = [];
                            }
                            pendingMessages[receiverId].push({ senderId, message });
                            console.log(`📥 Lưu tin nhắn chờ cho nhóm: ${senderId} -> ${receiverId}`);
                        }
                    });
                })
                .catch((err) => {
                    console.error('Error creating group message:', err);
                });
        });
        socket.on("start_call_audio", async ({ toUserId, fromUserId }) => {
            const result = await call.call_start({ toUserId, fromUserId });

            const { channelName, from, to } = result;

            const caller = await User.findOne({ idUser: fromUserId })
            const receiver = await User.findOne({ idUser: toUserId })

            socket.emit("receive_token", {
                channelName,
                uid: from.uid,
                token: from.token,
                receiverName: receiver.name,
                receiverAvatar: receiver.avatar
            });

            // Gửi token + channel cho người nhận nếu họ đang online
            const toSocketId = userSocketMap[toUserId];
            if (toSocketId) {
                io.to(toSocketId).emit("receive_token", {
                    channelName,
                    uid: to.uid,
                    token: to.token,
                    callerName: caller.name,
                    callerAvatar: caller.avatar,
                });
            }
        });
        socket.on('disconnect', () => {
            const userId = Object.keys(userSocketMap).find(
                (key) => userSocketMap[key] === socket.id
            );
            if (userId) {
                delete userSocketMap[userId];
                console.log(`❌ User ${userId} disconnected`);
            }
        });
    });
};

module.exports = config_websoket;
