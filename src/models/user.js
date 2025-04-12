const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    idUser: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    avatar: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('User', userSchema);
