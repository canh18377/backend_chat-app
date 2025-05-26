const express = require("express");
const router = express.Router();
const conversationController = require('../../controllers/conversationController');
const upload = require("../../middlewares/multer")
router.get('/', conversationController.getConversations);

router.post('/create-group', upload.single('avatar'), conversationController.createConversation);

module.exports = router;
