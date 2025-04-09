const express = require("express");
const { calculateShippingFee, getAvailableServices, getDistricts, getWards } = require("../../controllers/ghnController");
const router = express.Router();

router.get("/shipping/fee", calculateShippingFee);
router.post('/services', getAvailableServices);  // Lấy dịch vụ
router.get('/districts', getDistricts);         // Lấy quận
router.get('/wards/:district_id', getWards);    // Lấy phường theo district_id


module.exports = router;
