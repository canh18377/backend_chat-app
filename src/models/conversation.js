const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isGroup: { type: Boolean, default: false },
    name: { type: String }, // Tên nhóm nếu là group
    groupAvatar: { type: String }, // Ảnh nhóm
    createdAt: { type: Date, default: Date.now },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
