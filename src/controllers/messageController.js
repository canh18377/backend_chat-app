const Message = require('../models/message'); // Đảm bảo đã có model Message
const Conversation = require('../models/conversation'); // Model Conversation
const mongoose = require("mongoose");
class message {
    async getMessage(req, res) {
        try {
            const { conversationId } = req.params;
            if (!conversationId) {
                return res.status(400).json({ message: "Conversation ID is required" });
            }
            const conversationObjectId = new mongoose.Types.ObjectId(conversationId.trim());
            console.log(conversationObjectId)
            const msa = await Message.find()
            console.log(msa)
            console.log(msa[0].conversationId === conversationObjectId)
            const messages = await Message.find({ conversationId: conversationObjectId }).sort({ timestamp: 1 }).lean();

            if (!messages || messages.length === 0) {
                return res.json([]);
            }
            return res.status(200).json({ messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


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

}
module.exports = new message