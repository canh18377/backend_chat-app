const express = require("express");
const { registerShop, getShop } = require("../../controllers/shopController");
const router = express.Router();
const upload = require('../../middlewares/multer');
router.post("/register-shop",
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 }]), registerShop);
module.exports = router;
router.get("/communal/:id", getShop)

