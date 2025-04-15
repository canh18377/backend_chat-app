const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    idUser: {
        type: String,
        required: true,
        unique: true
    },
    name: { type: String, default: "User" },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    avatar: { type: String, default: null },
    createdAt: {
        type: Date,
        default: Date.now
    },
    pasword: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('User', userSchema);
