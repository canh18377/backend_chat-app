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
}
module.exports = new authController();
