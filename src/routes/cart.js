const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/:dishId', cartController.addItemToCart);
// router.put('/:dishId/increase', cartController.increaseItemQuantity);
// router.put('/:dishId/decrease', cartController.decreaseItemQuantity);
// router.delete('/:dishId', cartController.removeItemFromCart);
// router.post('/checkout', cartController.checkout);

module.exports = router;
