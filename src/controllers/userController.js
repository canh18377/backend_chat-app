const User = require('../models/user');

class userController {
    // Lấy thông tin người dùng hiện tại
    getCurrentUser = async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // Tìm kiếm người dùng theo tên
    getUser = async (req, res) => {
        const { searchBy } = req.params;
        try {
            const users = await User.find({
                name: { $regex: searchBy, $options: "i" }
            });
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // Cập nhật thông tin người dùng
    updateUser = async (req, res) => {
        try {
            const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
            res.json(updated);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // Xoá người dùng
    deleteUser = async (req, res) => {
        try {
            await User.findByIdAndDelete(req.user.id);
            res.json({ message: "User deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
}

module.exports = new userController();
