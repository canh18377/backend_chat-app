const passport = require('passport');
const jwt = require('jsonwebtoken');  // Thêm jwt
require('dotenv').config();
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
// Tạo Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ idUser: user.idUser, role: user.role }, process.env.ACCESS_TOKEN_SECRET);
};

class authController {
    authFB(req, res) {
        passport.authenticate('facebook')(req, res);
    }
    authGG(req, res) {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    }
    async responseAfterAuth(req, res) {
        console.log("11")
        try {
            const { redirectUrl } = req.user;
            res.redirect(redirectUrl);
        }
        catch (error) {
            console.error('Error during authentication', error);
            res.status(500).send('Authentication failed');
        }
    }
}
module.exports = new authController();
