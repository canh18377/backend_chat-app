const User = require('../models/user');
const conversation = require("../models/conversation")
const messages = require("../models/message");
const { uploadImage } = require("../utils/upload_to_cloudinary")
const fs = require('fs');
const upload = require('../middlewares/multer');

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
                return res.status(200).json([]);
            }
            const results = [];
            for (const conv of conversations) {
                const lastMessage = await messages.findById(conv.lastMessage);
                if (conv.isGroup) {
                    results.push({ conversation: conv, lastMessage });
                } else {
                    const receiverId = conv.participants.find(id => id !== req.user.idUser);
                    const user = await User.findOne({ idUser: receiverId });
                    const plainUser = user.toObject();
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

    // Tạo cuộc trò chuyện nhóm
    createConversation = async (req, res) => {
        try {
            const { participants, isGroup, name } = req.body;

            if (!participants || participants.length < 2) {
                return res.status(400).json({ message: "Participants are required and must be at least two users." });
            }

            let participantList = participants;
            if (typeof participants === 'string') {
                participantList = [participants];
            }
            let groupAvatarUrl = null;

            if (req.file) {
                try {
                    const result = await uploadImage(req.file.path)
                    groupAvatarUrl = result || null;
                } catch (uploadError) {
                    console.log(uploadError)
                }
            }

            const newConversation = new conversation({
                participants: participantList,
                isGroup: true,
                name: name,
                groupAvatar: groupAvatarUrl,
                createdAt: new Date(),
            });

            const savedConversation = await newConversation.save();

            res.status(201).json(savedConversation);

        } catch (err) {
            console.error('Create conversation error:', err);
            res.status(500).json({ message: err.message });
        }
    };
}

module.exports = new conversationController();