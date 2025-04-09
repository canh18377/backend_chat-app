const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);
