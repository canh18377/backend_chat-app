const express = require("express");
const router = express.Router();
const userController = require('../../controllers/userController');
const upload = require("../../middlewares/multer")
// router.post('/register', userController.register);
// router.post('/login', userController.login);
router.get('/me', userController.getCurrentUser);
router.get('/getUsers/:searchBy', userController.getUser);
router.put(
    '/update',
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    userController.updateUser
);
router.delete('/delete', userController.deleteUser);

module.exports = router;
