const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/add-to-cart', shopController.postAddToCart);
router.post('/del-cart-item', shopController.postDeleteCartItem);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);

module.exports = router;
