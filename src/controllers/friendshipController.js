const Friendship = require('../models/friendShip');
const User = require('../models/user')
class friendShip {

    // Gửi lời mời kết bạn
    sendRequest = async (req, res) => {
        const { recipientId } = req.body;
        const requesterId = req.user.idUser; // bạn cần middleware auth để có req.user

        try {
            if (recipientId === requesterId) {
                res.status(400).json("request Invalid")
                return
            }
            // Kiểm tra đã có yêu cầu trước đó chưa
            const existing = await Friendship.findOne({
                requester: requesterId,
                recipient: recipientId
            });

            if (existing) return res.status(400).json({ message: 'Friend request already sent' });

            const friendRequest = new Friendship({
                requester: requesterId,
                recipient: recipientId,
                status: 'pending'
            });

            await friendRequest.save();

            res.status(201).json({ message: 'Friend request sent' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
    getListFriendRequest = async (req, res) => {
        const recipientId = req.user.idUser; // bạn cần middleware auth để có req.user

        try {
            // Tìm kiếm các yêu cầu kết bạn với trạng thái "pending" mà người dùng là người nhận
            const list = await Friendship.find({ recipient: recipientId, status: "pending" });

            // Lấy thông tin người gửi yêu cầu kết bạn
            const detailedList = await Promise.all(list.map(async (friendRequest) => {
                // Tìm thông tin người gửi yêu cầu kết bạn
                const requester = await User.findOne({ idUser: friendRequest.requester });

                if (requester) {
                    // Loại bỏ các trường không cần thiết (password và email)
                    const { password, email, ...exclusiveField } = requester.toObject();
                    return {
                        ...friendRequest.toObject(),
                        requester: exclusiveField  // Thêm thông tin người gửi
                    };
                }

                // Nếu không tìm thấy người gửi, trả về null
                return {
                    ...friendRequest.toObject(),
                    requester: null
                };
            }));

            // Trả về danh sách yêu cầu kết bạn nhận được cùng với thông tin người gửi
            res.status(200).json(detailedList);
        } catch (err) {
            // Xử lý lỗi khi có sự cố trong quá trình truy vấn
            res.status(500).json({ message: err.message });
        }
    };

    getSentFriendRequests = async (req, res) => {
        const requesterId = req.user.idUser;

        try {
            const list = await Friendship.find({
                requester: requesterId,
                status: 'pending'
            });

            const detailedList = await Promise.all(list.map(async (friendRequest) => {
                const recipient = await User.findOne({ idUser: friendRequest.recipient });

                if (recipient) {
                    const { password, email, ...exclusiveField } = recipient.toObject(); // Loại bỏ password và email
                    return {
                        ...friendRequest.toObject(),
                        recipient: exclusiveField  // Thêm thông tin người nhận
                    };
                }

                return {
                    ...friendRequest.toObject(),
                    recipient: null
                };
            }));

            res.status(200).json(detailedList);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };



    // Chấp nhận lời mời kết bạn
    acceptRequest = async (req, res) => {
        const { requestId } = req.params;
        const userId = req.user.idUser;
        try {
            const request = await Friendship.findById(requestId);

            if (!request) return res.status(404).json({ message: 'Request not found' });
            if (request.recipient.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            request.status = 'accepted';
            await request.save();

            res.json({ message: 'Friend request accepted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // Từ chối hoặc hủy kết bạn
    rejectRequest = async (req, res) => {
        const { requestId } = req.params;
        const userId = req.user.idUser;

        try {
            const request = await Friendship.findById(requestId);

            if (!request) return res.status(404).json({ message: 'Request not found' });
            if (
                request.recipient.toString() !== userId.toString() &&
                request.requester.toString() !== userId.toString()
            ) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            await request.deleteOne();

            res.json({ message: 'Request cancelled or rejected' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // Lấy danh sách bạn bè đã chấp nhận
    getFriends = async (req, res) => {
        const userId = req.user.idUser;

        try {
            const friends = await Friendship.find({
                $or: [
                    { requester: userId, status: 'accepted' },
                    { recipient: userId, status: 'accepted' }
                ]
            }).populate('requester recipient');

            res.json(friends);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
}
module.exports = new friendShip()