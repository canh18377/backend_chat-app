const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const upload = require('../../middlewares/multer');

// CRUD Routes
router.get('/:isCommunal/:searchBy/:limit/:pageNumber/:isApproved', productController.getProducts);
router.get('/communal/:id', productController.getProductById);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 4 }, { name: 'video', maxCount: 1 }]), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/', upload.fields([{ name: 'image', maxCount: 4 }, { name: 'video', maxCount: 1 }]), productController.createProduct);


module.exports = router;
