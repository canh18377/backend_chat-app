const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.get('/:id', userController.getUserById);        // Get User by ID
router.post('/', userController.createUser);           // Create a new User
router.put('/:id', userController.updateUser);         // Update User
router.delete('/:id', userController.deleteUser);     // Delete User
router.get('/', userController.getUsers);              // Get all Users (optional)

module.exports = router;
