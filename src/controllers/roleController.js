const { statusCode, responseCode, message, sendResponse } = require('../utils/responseCode');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const roleSchema = require('../models/role'); // Assuming the model is imported
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
class roleController {
    async index(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return sendResponse(res, responseCode.forbidden, statusCode.fail, {}, "No refresh token provided");
        }
        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            const role = await roleSchema.findOne({ idUser: decoded.idUser });
            if (!role) {
                return sendResponse(res, responseCode.notFound, statusCode.fail, {}, "Role not found");
            }
            return sendResponse(res, responseCode.success, statusCode.success, role?.role, "");
        } catch (err) {
            return sendResponse(res, responseCode.forbidden, statusCode.fail, {}, `Error: ${err.message}`);
        }
    }
}

module.exports = new roleController();
