const express = require("express");
const router = express.Router();
const conversationController = require('../../controllers/conversationController');
router.get('/conversation', conversationController.getConversations);


module.exports = router;
