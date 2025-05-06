const express = require('express');
const router = express.Router();
const friendshipController = require('../../controllers/friendshipController');

router.post('/send-request', friendshipController.sendRequest);
router.put('/accept/:requestId', friendshipController.acceptRequest);
router.delete('/reject/:requestId', friendshipController.rejectRequest);
router.get('/friends', friendshipController.getFriends);
router.get('/requests/received', friendshipController.getListFriendRequest);
router.get('/requests/sent', friendshipController.getSentFriendRequests);
module.exports = router;
