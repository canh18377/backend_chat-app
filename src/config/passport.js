const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
    enableProof: true
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Tìm user bằng Facebook ID
            let user = await User.findOne({ idUser: profile.id });
            if (!user) {
                // Nếu chưa tồn tại thì tạo mới
                user = await User.create({
                    idUser: profile.id,
                    name: profile.displayName,
                    avatar: profile.photos[0]?.value || null,
                    email: profile.emails[0]?.value || null
                });
            }
            // Tạo Access Token và Refresh Token
            const generatedAccessToken = jwt.sign(
                { idUser: user.idUser, role: role.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            const generatedRefreshToken = jwt.sign(
                { idUser: user.idUser, role: role.role },
                process.env.REFRESH_TOKEN_SECRET
            );
            // Trả về token
            done(null, { accessToken: generatedAccessToken, refreshToken: generatedRefreshToken, user: user });
        } catch (err) {
            console.error("Lỗi khi xác thực Facebook:", err);
            return done(err);
        }
    }
));
//gmail
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Tìm user bằng Facebook ID
            let user = await User.findOne({ idUser: profile.id });
            if (!user) {
                // Nếu chưa tồn tại thì tạo mới
                user = await User.create({
                    idUser: profile.id,
                    name: profile.displayName,
                    avatar: profile.photos[0]?.value || null,
                    email: profile.emails[0]?.value || null
                });
            }
            // Tạo Access Token và Refresh Token
            const generatedAccessToken = jwt.sign(
                { idUser: user.idUser },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            const generatedRefreshToken = jwt.sign(
                { idUser: user.idUser },
                process.env.REFRESH_TOKEN_SECRET
            );
            // Trả về token
            done(null, { accessToken: generatedAccessToken, refreshToken: generatedRefreshToken, user: user });
        } catch (err) {
            console.error("Lỗi khi xác thực Facebook:", err);
            return done(err);
        }
    }
));
