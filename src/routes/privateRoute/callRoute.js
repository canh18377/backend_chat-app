const express = require("express");
const router = express.Router();
const callController = require('../../controllers/callController');
router.post('/start', callController.call_start);
module.exports = router;