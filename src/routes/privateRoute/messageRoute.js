const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer")
const messageController = require('../../controllers/messageController');
router.get('/:exist/:data', messageController.getMessage);
router.post(
    '/saveImg',
    upload.single("image"),
    messageController.saveImage
);
module.exports = router;
