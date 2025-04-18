const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    requester: {
        type: String,
        ref: 'User',
        required: true
    },
    recipient: {
        type: String,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Friendship', FriendshipSchema);
