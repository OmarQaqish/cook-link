const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();

router.get('/', cartController.getCart);

router.post('/checkout', cartController.checkout);
router.post('/:dishId', cartController.addItemToCart);
router.delete('/:dishId', cartController.removeItemFromCart);

router.put('/:dishId/increase', cartController.increaseItemQuantity);
router.put('/:dishId/decrease', cartController.decreaseItemQuantity);

module.exports = router;
