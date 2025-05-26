const User = require('../models/user');
const conversation = require("../models/conversation")
const messages = require("../models/message");
const cloudinary = require('../config/cloudinary'); 
const fs = require('fs');

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
            
            console.log('Request body:', req.body);
            console.log('File:', req.file);
            
            if (!participants || participants.length < 2) {
                return res.status(400).json({ message: "Participants are required and must be at least two users." });
            }

            let participantList = participants;
            if (typeof participants === 'string') {
                participantList = [participants];
            }
            
            if (!isGroup || isGroup === 'false') {
                const existingConversation = await conversation.findOne({
                    isGroup: false,
                    participants: { $all: participantList, $size: participantList.length }
                });

                if (existingConversation) {
                    return res.status(200).json({ 
                        message: "Conversation already exists", 
                        conversation: existingConversation 
                    });
                }
            }

            let groupAvatarUrl = null;

            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: 'group_avatars',
                        resource_type: 'image'
                    });
                    groupAvatarUrl = result.secure_url;
                    
                    fs.unlinkSync(req.file.path);
                } catch (uploadError) {
                    console.error('Upload avatar error:', uploadError);
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }
                }
            }

            const newConversation = new conversation({
                participants: participantList,
                isGroup: isGroup === 'true' || isGroup === true,
                name: (isGroup === 'true' || isGroup === true) ? name : null,
                groupAvatar: groupAvatarUrl,
                createdAt: new Date(),
            });

            const savedConversation = await newConversation.save();
            
            // Populate thông tin participants để trả về
            const populatedConversation = await conversation.findById(savedConversation._id)
                .populate('participants', 'idUser name avatar');

            res.status(201).json(populatedConversation);

        } catch (err) {
            console.error('Create conversation error:', err);
            
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            res.status(500).json({ message: err.message });
        }
    };
}

module.exports = new conversationController();