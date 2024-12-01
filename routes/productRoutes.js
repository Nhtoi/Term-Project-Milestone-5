const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', (req, res) => res.render('index', { title: 'Home' }));
router.get('/products', productController.getProducts);
router.get('/details/:id', productController.getProductDetails);

module.exports = router;
