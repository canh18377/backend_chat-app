const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation', // nếu bạn có model cuộc hội thoại
        required: true
    },
    sender: {
        type: String,
        ref: 'User', // nếu bạn có model user
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'User', // hoặc có thể là group chat, tùy thuộc ứng dụng của bạn
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Message', MessageSchema);
