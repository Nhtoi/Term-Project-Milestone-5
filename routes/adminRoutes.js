const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer'); 

const upload = multer({ dest: './uploads/' });

router.get('/products', adminController.getAdminProducts);
router.get('/upload', adminController.getBulkUploadPage);
router.post('/upload', upload.single('file-upload'), adminController.handleBulkUpload);
router.get('/edit/:id', adminController.getEditProductPage);
router.post('/edit/save-product', adminController.saveProductChanges);
router.get('/delete/:id', adminController.deleteProduct);

module.exports = router;
