const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/cart/add', cartController.addToCart);
router.get('/cart', cartController.getCart);
router.post('/cart/clear', cartController.clearCart);
module.exports = router;
