const User = require('../models/user');
const { uploadImage } = require('../utils/upload_to_cloudinary')
class userController {
    // Lấy thông tin người dùng hiện tại
    getCurrentUser = async (req, res) => {
        try {
            const user = await User.findOne({ idUser: req.user.idUser });
            const plainUser = user.toObject(); // hoặc user.toJSON()
            delete plainUser.password;
            res.json(plainUser);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // Tìm kiếm người dùng theo tên
    getUser = async (req, res) => {
        const { searchBy } = req.params;
        try {
            const data = await User.find({
                name: { $regex: searchBy, $options: "i" }
            })
            let users = []
            if (data.length !== 0) {
                users = data.map(user => {
                    const plainUser = user.toObject()
                    delete plainUser.password;
                    return plainUser
                })
            }
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // Cập nhật thông tin người dùng
    updateUser = async (req, res) => {
        const idUser = req.user.idUser
        const { name, email } = req.body
        const images = req.files?.avatar || [];
        const imageUrls = await Promise.all(images.map((img) => uploadImage(img.path)))
        try {
            const updated = await User.findOneAndUpdate({ idUser: idUser }, { name: name, email: email, avatar: imageUrls[0] });
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
