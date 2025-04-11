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
        type: String,
        ref: 'User', // hoặc có thể là group chat, tùy thuộc ứng dụng của bạn
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'file'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    }
});

module.exports = mongoose.model('Message', MessageSchema);
