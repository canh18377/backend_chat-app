const Message = require('../models/message'); // Đảm bảo đã có model Message
const Conversation = require('../models/conversation'); // Model Conversation
const { uploadImage } = require("../utils/upload_to_cloudinary")
class message {
    async getMessage(req, res) {
        try {
            const idUser = req.user.idUser;
            const { data, exist } = req.params;
            let conversationId;
            console.log(data)
            if (exist === 'false') {
                // Parse data thành mảng participants
                const participants = JSON.parse(data);
                const existingConversation = await Conversation.findOne({
                    isGroup: false,
                    participants: { $all: participants, $size: 2 }
                });
                if (!existingConversation) {
                    const conversation = await Conversation.create({
                        participants: [...participants],
                        isGroup: false
                    });
                    conversationId = conversation._id;
                } else conversationId = existingConversation._id;
            } else {
                // exist === 'true', thì data chính là conversationId
                conversationId = data;
            }

            // Lấy danh sách tin nhắn
            const messages = await Message.find({ conversationId })
                .sort({ timestamp: -1 })
                .lean();

            return res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    updateMessage = async (messageId, newMessage) => {
        try {
            const updatedMessage = await Message.findOneAndUpdate(
                { _id: messageId },
                { content: newMessage },
                { new: true }
            );
            return updatedMessage;
        } catch (error) {
            console.error("Error updating message:", error);
            return false;
        }
    };

    recalledMessage = async (messageId) => {
        try {
            const updatedMessage = await Message.findOneAndUpdate(
                { _id: messageId },
                { content: null },
                { new: true }
            );
            return updatedMessage;
        } catch (error) {
            console.error("Error updating message:", error);
            return false;
        }
    };

    createMessage = async (senderId, receiverId, message, isGroup = false, groupName = '', groupAvatar = '') => {
        try {
            // Kiểm tra xem conversation đã có chưa
            let conversation;
            if (isGroup) {
                if (!Array.isArray(receiverId)) {
                    return res.status(400).json({ message: "receiverId phải là mảng các userId trong trường hợp nhóm" });
                }
                conversation = await Conversation.findOne({ name: groupName, participants: { $all: [senderId, ...receiverId] } });
                if (!conversation) {
                    // Nếu chưa có, tạo mới
                    conversation = new Conversation({
                        participants: [senderId, ...receiverId],
                        isGroup: true,
                        name: groupName,
                        groupAvatar: groupAvatar
                    });
                    await conversation.save();
                }
            } else {
                // Chat 1-1, tìm conversation giữa 2 người
                conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                if (!conversation) {
                    // Nếu chưa có, tạo mới
                    conversation = new Conversation({
                        participants: [senderId, receiverId],
                        isGroup: false
                    });
                    await conversation.save();
                }
            }

            // Tạo message mới
            const newMessage = new Message({
                conversationId: conversation._id,
                sender: senderId,
                receiver: receiverId,
                content: message
            });
            await newMessage.save();

            // Cập nhật `lastMessage` của Conversation
            conversation.lastMessage = newMessage._id;
            await conversation.save();

            return newMessage; // Trả về tin nhắn vừa tạo
        } catch (err) {
            console.error("Error creating message:", err);
            throw err;
        }
    };
    async saveImage(req, res) {
        try {
            const image = req.file?.path
            if (!image) {
                return res.status.json("")
            }
            const imageUrl = await uploadImage(image)
            res.status(200).json(imageUrl)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

}
module.exports = new message