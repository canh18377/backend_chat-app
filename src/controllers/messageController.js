const Message = require('../models/message'); // Đảm bảo đã có model Message
const Conversation = require('../models/conversation'); // Model Conversation

class message {
    async getMessage(req, res) {
        try {
            // Lấy conversationId từ request
            const { conversationId } = req.params; // Sử dụng req.params nếu nó được truyền qua URL, hoặc req.body nếu từ body
            console.log(conversationId)
            // Kiểm tra xem có conversationId không
            if (!conversationId) {
                return res.status(400).json({ message: "Conversation ID is required" });
            }

            // Truy vấn tất cả tin nhắn liên quan đến conversationId
            const messages = await Message.find({ conversationId: conversationId })
                .sort({ timestamp: 1 }) // Sắp xếp theo thứ tự thời gian
                .exec();
            console.log(messages)
            // Kiểm tra xem có tin nhắn nào không
            if (!messages || messages.length === 0) {
                return res.status(404).json([]);
            }

            // Trả về danh sách tin nhắn
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