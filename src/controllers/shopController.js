const axios = require("axios");
require("dotenv").config();
const shopSchema = require("../models/shop");
const { sendResponse, responseCode, statusCode } = require("../utils/responseCode");
const { uploadImage } = require('../utils/upload_to_cloudinary');

const registerShop = async (req, res) => {
    try {
        const { name, phone, address, ward, description, district } = req.body;
        const { idUser } = req.user;
        const { avatar, background } = req.files;
        const avatarUrl = await uploadImage(avatar[0].path);
        const backgroundUrl = await uploadImage(background[0].path);

        const existingShop = await shopSchema.findOne({ createBy: idUser });
        if (existingShop) {
            return sendResponse(res, responseCode.existed, statusCode.fail, {}, "Shop already exists");
        }
        // Call GHN API to register shop
        const response = await axios.post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/register",
            { name, phone, address, ward_code: ward, district_id: Number.parseInt(district) },
            { headers: { "Content-Type": "application/json", "Token": process.env.GHN_TOKEN } }
        );

        const shopId = response.data.data.shop_id; // Corrected response extraction

        const newShop = await shopSchema.create({
            name: name,
            shop_id: shopId,
            phone: phone,
            address: address,
            ward_code: ward,
            description: description,
            avatar: avatarUrl,
            background: backgroundUrl,
            district_id: district,
            createBy: idUser,
        });

        return sendResponse(res, responseCode.created, statusCode.success, newShop, "Shop registered successfully");
    } catch (error) {
        console.error("GHN API Error:", error.response?.data || error.message);
        return sendResponse(res, responseCode.serverError, statusCode.fail, error, "Failed to register shop");
    }
};
const getShop = async (req, res) => {
    try {
        const { id } = req.params;
        const existingShop = await shopSchema.findOne({ shop_id: id });
        if (!existingShop) {
            return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Shop already exists");
        }
        return sendResponse(res, responseCode.success, statusCode.success, existingShop, "data shop");
    } catch (error) {
        return sendResponse(res, responseCode.serverError, statusCode.fail, error, "Failed shop");
    }
};

module.exports = { getShop, registerShop };
