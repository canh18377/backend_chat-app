const passport = require('passport');
const jwt = require('jsonwebtoken');  // Thêm jwt
require('dotenv').config();
const { statusCode, responseCode, message, sendResponse } = require('../utils/responseCode')
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
const secretRole = process.env.SECRET_ROLE
const roleSchema = require('../models/role')
// Tạo Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ idUser: user.idUser, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m', // Access Token sống 15 phút
    });
};

class authController {
    authFB(req, res) {
        passport.authenticate('facebook')(req, res);
    }
    authGG(req, res) {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    }
    async responseAfterAuth(req, res) {
        try {
            const { accessToken, refreshToken, user } = req.user;
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,   // Bảo vệ chống XSS
                secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS khi production
                sameSite: 'Strict', // Bảo vệ chống CSRF
            });
            const role = await roleSchema.findOne({ idUser: user.idUser })
            // Gửi Access Token về React qua postMessage
            res.send(`
                <script>
                  window.opener.postMessage({
                    accessToken: '${accessToken}',
                    role: '${role.role}',
                    idUser:'${user.idUser}'
                  }, 'http://localhost:3000');
                  window.close();
                </script>
              `);

        }
        catch (error) {
            console.error('Error during authentication', error);
            res.status(500).send('Authentication failed');
        }
    }
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return sendResponse(res, responseCode.forbidden, statusCode.fail, {}, "");
            }
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            // Tạo Access Token mới
            const newAccessToken = generateAccessToken(decoded);
            // Trả về Access Token mới và Role
            return sendResponse(res, responseCode.success, statusCode.success, {
                accessToken: newAccessToken
            }, "");
        } catch (err) {
            return sendResponse(res, responseCode.forbidden, statusCode.fail, {}, "Invalid token");
        }
    }

}
module.exports = new authController();
