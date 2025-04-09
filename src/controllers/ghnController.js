const axios = require('axios');
require('dotenv').config();
const shopShema = require("../models/shop")
const { statusCode, responseCode, sendResponse } = require('../utils/responseCode');

class ghnController {
    async calculateShippingFee(req, res) {
        try {
            const {
                to_district_id = 1450,
                service_type_id = 2,
                weight = 2000,
                height = 20,
                width = 15,
                length = 30,
                insurance_value = 500000
            } = req.body; // Lấy dữ liệu từ request body hoặc dùng giá trị mặc định

            const response = await axios.post(
                `${process.env.GHN_API_URL}/shipping-order/fee`,
                {
                    from_district_id: 2509634,
                    service_id: 53320,
                    service_type_id,
                    to_district_id,
                    weight,
                    height,
                    width,
                    length,
                    insurance_value,
                    coupon: null
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Token": process.env.GHN_TOKEN,
                        "ShopId": process.env.SHOP_ID
                    }
                }
            );

            return sendResponse(res, responseCode.success, statusCode.success, response.data, "Shipping fee calculated successfully.");
        } catch (error) {
            console.error("GHN API Error:", error.response?.data || error.message);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred while calculating shipping fee.");
        }
    }

    async getAvailableServices(req, res) {
        const { selectedDistrict, orderData } = req.body
        try {
            let service = []
            for (const order of orderData) {
                const shop = await shopShema.findOne({ shop_id: order.shop_id });
                if (!shop) {
                    return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Shop does not exist");
                }

                const response = await axios.get(
                    `${process.env.GHN_API_URL}/v2/shipping-order/available-services`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "token": process.env.GHN_TOKEN,
                            "ShopId": process.env.SHOP_ID
                        },
                        params: {
                            shop_id: shop.shop_id,
                            from_district: shop.district_id,
                            to_district: selectedDistrict
                        }
                    }
                );
                if (response) {
                    service.push({ productId: order.productId, service: response.data })
                } else return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred while fetching available services.");
            }
            console.log(service)
            return sendResponse(res, responseCode.success, statusCode.success, service, "Available services fetched successfully.");
        } catch (error) {
            console.error("GHN API Error:", error.response?.data || error.message);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred while fetching available services.");
        }
    }

    async getDistricts(req, res) {
        try {
            const response = await axios.get(
                `${process.env.GHN_API_URL}/master-data/district`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Token": process.env.GHN_TOKEN,
                        "ShopId": process.env.SHOP_ID
                    }
                }
            );
            return sendResponse(res, responseCode.success, statusCode.success, response.data, "Districts fetched successfully.");
        } catch (error) {
            console.error("GHN API Error:", error.response?.data || error.message);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred while fetching districts.");
        }
    }

    async getWards(req, res) {
        try {
            const { district_id } = req.params;
            const response = await axios.get(
                `${process.env.GHN_API_URL}/master-data/ward?district_id=${district_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Token": process.env.GHN_TOKEN,
                        "ShopId": process.env.SHOP_ID
                    }
                }
            );
            return sendResponse(res, responseCode.success, statusCode.success, response.data, "Wards fetched successfully.");
        } catch (error) {
            console.error("GHN API Error:", error.response?.data || error.message);
            return sendResponse(res, responseCode.serverError, statusCode.fail, {}, error.message || "An error occurred while fetching wards.");
        }
    }
}

module.exports = new ghnController();
