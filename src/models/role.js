const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roleSchema = new Schema({
    idUser: {
        type: String,
        ref: 'user',
        required: true
    },
    role: { type: String, default: "user" }
});

module.exports = mongoose.model('role', roleSchema);
