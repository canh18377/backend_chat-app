const express = require("express");
const router = express.Router();
const messageController = require('../../controllers/messageController');
router.get('/:conversationId', messageController.getMessage);

module.exports = router;
