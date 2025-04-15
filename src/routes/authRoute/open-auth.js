const express = require("express");
require('dotenv').config();
const passport = require('passport');
const router = express.Router();
const authController = require('../../controllers/authController')
router.get('/facebook', authController.authFB);
router.get('/google', authController.authGG);
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', session: false }), authController.responseAfterAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), authController.responseAfterAuth);
router.post('/login', authController.Login);
router.post('/register', authController.Register);
module.exports = router;
