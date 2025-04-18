const express = require('express');
const router = express.Router();
const friendshipController = require('../../controllers/friendshipController');

router.post('/send-request', friendshipController.sendRequest);
router.put('/accept/:requestId', friendshipController.acceptRequest);
router.delete('/reject/:requestId', friendshipController.rejectRequest);
router.get('/friends', friendshipController.getFriends);

module.exports = router;
