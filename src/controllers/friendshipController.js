const Friendship = require('../models/friendShip');
class friendShip {

    // Gửi lời mời kết bạn
    sendRequest = async (req, res) => {
        const { recipientId } = req.body;
        const requesterId = req.user.idUser; // bạn cần middleware auth để có req.user

        try {
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
            const list = await Friendship.find({ recipient: recipientId, status: "pending" })
            res.status(201).json(list);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    getSentFriendRequests = async (req, res) => {
        const requesterId = req.user._id;

        try {
            const list = await Friendship.find({
                requester: requesterId,
                status: 'pending'
            }).populate('recipient', 'name avatar');

            res.status(200).json(list);
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