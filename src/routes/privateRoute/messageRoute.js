const express = require("express");
const router = express.Router();
const messageController = require('../../controllers/messageController');
router.get('/:exist/:data', messageController.getMessage);
module.exports = router;
