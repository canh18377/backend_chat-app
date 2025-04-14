const express = require("express");
const router = express.Router();
const conversationController = require('../../controllers/conversationController');
router.get('/', conversationController.getConversations);


module.exports = router;
