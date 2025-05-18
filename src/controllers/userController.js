const conversation = require('../models/conversation');
const friendShip = require('../models/friendShip');
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
        const currentUserId = req.user.idUser; // cần middleware auth gán req.user

        try {
            const users = await User.find({
                name: { $regex: searchBy, $options: "i" },
                idUser: { $ne: currentUserId } // không trả chính bản thân
            });

            const result = await Promise.all(users.map(async user => {
                const plainUser = user?.toObject();
                delete plainUser.password;

                // Kiểm tra bạn bè
                const friendship = await friendShip.findOne({
                    $or: [
                        { requester: currentUserId, recipient: user?.idUser },
                        { requester: user?.idUser, recipient: currentUserId }
                    ],
                    status: { $in: ['accepted', 'pending'] }
                });

                // Kiểm tra cuộc trò chuyện
                const conv = await conversation.findOne({
                    participants: { $all: [currentUserId.toString(), user?.idUser.toString()] },
                    isGroup: false
                });

                return {
                    ...plainUser,
                    isFriend: !!friendship,
                    hasConversation: !!conv
                };
            }));

            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // Cập nhật thông tin người dùng
    updateUser = async (req, res) => {
        const idUser = req.user.idUser
        const { name, email } = req.body
        const image = req.file?.path
        let imageUrl = null
        if (image) { imageUrl = await uploadImage(image) }
        let updateData = {
            name: name,
            email: email,
        }
        if (imageUrl) {
            updateData.avatar = imageUrl
        }
        try {
            const updated = await User.findOneAndUpdate({ idUser: idUser }, updateData, { new: true });
            const newInfo = updated.toObject()
            delete newInfo.password
            res.json(newInfo);
        } catch (err) {
            console.log(err);
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
