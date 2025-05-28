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
                io.to(receiverSocketId).emit('receive_message',
                    newMessage
                );
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
        socket.on('deleteMessage', async (message) => {
            const recalledMess = await messageController.recalledMessage(message._id);
            if (recalledMess) {
                socket.emit("deleted_message", recalledMess)
            }
            const receiverSocketId = userSocketMap[message.receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('deleted_message',
                    recalledMess
                );
                console.log(`📤 ${message.senderId} -> ${receiver}: ${message}`);
            } else {
                // Người nhận chưa online → lưu vào pendingMessages
                if (!pendingMessages[message.receiver]) {
                    pendingMessages[message.receiver] = [];
                }
                pendingMessages[message.receiver].push({ senderId: message.sender, message });
                console.log(`📥 Lưu tin nhắn chờ: ${message.senderId} -> ${message.receiver}`);
            }
        });
        socket.on('updateMessage', async ({ item, updateMessage }) => {
            const newMessage = await messageController.updateMessage(item._id, updateMessage);
            if (newMessage) {
                socket.emit("updated_message", newMessage)
            }
            const receiverSocketId = userSocketMap[item.receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('updated_message',
                    newMessage
                );
            } else {
                // Người nhận chưa online → lưu vào pendingMessages
                if (!pendingMessages[item.receiver]) {
                    pendingMessages[item.receiver] = [];
                }
                pendingMessages[item.receiver].push({ senderId: item.sender, newMessage });
            }
        });

        socket.on('group_message', async ({ senderId, receiverIds, message, groupName, groupAvatar }) => {
            // Lưu tin nhắn nhóm vào cơ sở dữ liệu
            const isGroup = true
            const newMessage = await messageController.createMessage(senderId, receiverIds, message, isGroup, groupName, groupAvatar)
            if (newMessage) {
                socket.emit("receive_message", newMessage)
            }
            receiverIds.forEach((receiverId) => {
                const receiverSocketId = userSocketMap[receiverId];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receive_message', newMessage);
                } else {
                    // Lưu tin nhắn vào pendingMessages nếu người nhận chưa online
                    if (!pendingMessages[receiverId]) {
                        pendingMessages[receiverId] = [];
                    }
                    pendingMessages[receiverId].push({ senderId, newMessage });
                }
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