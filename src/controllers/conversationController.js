const User = require('../models/user');
const conversation = require("../models/conversation")
class conversationController {
    // Lấy thông tin người dùng hiện tại
    getConversations = async (req, res) => {
        try {
            const user = await User.findById(req.user.idUser)
            if (!user) {
                res.status(404).json("not found");
            }
            const conversations = await conversation.find({ participants: { $in: [user.idUser] } });
            if (conversations) {
                res.json(conversations);
            } else res.status(404).json("not found");
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
}
module.exports = new conversationController();
