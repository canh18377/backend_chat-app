const express = require("express");
require('dotenv').config();
const passport = require('passport');
const router = express.Router();
const authController = require('../../controllers/authController')
router.get('/facebook', authController.authFB);
router.get('/google', (req, res, next) => {
    console.log("auth google")
    next()
})
    , authController.authGG;
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', session: false }), authController.responseAfterAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), authController.responseAfterAuth);
module.exports = router;
