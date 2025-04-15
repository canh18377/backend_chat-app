const passport = require('passport');
const jwt = require('jsonwebtoken');  // Thêm jwt
require('dotenv').config();
const User = require('../models/user');
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
    async Login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email, password: password })
            if (user) {
                const generatedAccessToken = jwt.sign(
                    { idUser: user.idUser },
                    process.env.ACCESS_TOKEN_SECRET,
                );
                res.status(201).json(generatedAccessToken)
            } else {
                res.status(404).json(null)
            }
        }
        catch (error) {
            console.error('', error);
            res.status(500).send('Authentication failed');
        }
    }
    async Register(req, res) {
        try {
            const { email, password, userName } = req.body
            const user = await User.findOne({ email: email })
            if (user) {
                res.status(401).json("user exits")
            } else {
                const newUser = await User.create({ idUser: email, email: email, password: password, name: userName })
                res.status(201).json(newUser)
            }
        }
        catch (error) {
            console.error('', error);
            res.status(500).send('Authentication failed');
        }
    }
    async responseAfterAuth(req, res) {
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
