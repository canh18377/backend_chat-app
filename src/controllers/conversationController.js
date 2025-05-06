const User = require('../models/user');
const conversation = require("../models/conversation")
const messages = require("../models/message");
class conversationController {
    // Lấy thông tin người dùng hiện tại
    getConversations = async (req, res) => {
        try {
            const user = await User.findOne({ idUser: req.user.idUser })
            if (!user) {
                res.status(404).json("not found user");
            }
            const conversations = await conversation.find({ participants: { $in: [req.user.idUser] } });

            if (!conversations || conversations.length === 0) {
                return res.status(404).json("not found conversation");
            }
            const results = [];
            for (const conv of conversations) {
                const lastMessage = await messages.findById(conv.lastMessage);
                if (conv.isGroup) {
                    results.push({ conversation: conv, lastMessage });
                } else {
                    const receiverId = conv.participants.find(id => id !== req.user.idUser);
                    const user = await User.findOne({ idUser: receiverId });
                    const plainUser = user.toObject(); // hoặc user.toJSON()
                    delete plainUser.password;
                    results.push({ conversation: conv, lastMessage, plainUser });
                }
            }
            res.json(results);
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: err.message });
        }
    };
    createConversation = async (req, res) => {
        try {
            const { participant } = req.body;
            // Kiểm tra tham số
            if (!participant || !Array.isArray(participant) || participant.length < 2) {
                return res.status(400).json({ message: "Participant are required and must be at least two users." });
            }

            // Nếu là cuộc trò chuyện cá nhân, kiểm tra xem đã tồn tại chưa
            if (!isGroup) {
                const existingConversation = await conversation.findOne({
                    isGroup: false,
                    participant: { $all: participant, $size: 2 }
                });

                if (existingConversation) {
                    return res.status(200).json({ message: "Conversation already exists", conversation: existingConversation });
                }
            }

            // Tạo cuộc trò chuyện mới
            const newConversation = new conversation({
                participant,
                isGroup,
                name: isGroup ? name : null,
                createdAt: new Date(),
            });

            const savedConversation = await newConversation.save();
            res.status(201).json(savedConversation);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    };
}
module.exports = new conversationController();
