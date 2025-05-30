const express = require("express");
const router = express.Router();
const authenticate = require('../../middlewares/authMiddleware');

// Blacklist để lưu các token đã logout
const tokenBlacklist = new Set();

// API logout
router.post('/logout', authenticate, (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const rawToken = authHeader.split(' ')[1];
        const accessToken = rawToken.split('#')[0];

        // Thêm token vào blacklist
        tokenBlacklist.add(accessToken);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
});

module.exports = { router, tokenBlacklist };