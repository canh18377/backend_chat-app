const mongoose = require('mongoose');

const MessageStatusSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['delivered', 'read'],
        required: true
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MessageStatus', MessageStatusSchema);
