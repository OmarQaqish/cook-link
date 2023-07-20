const express = require('express');
const orderController = require('../controllers/order');

const router = express.Router();

router.get('/', orderController.getAllOrders);
/*
router.get('/:id', orderController.getOneOrder);
router.put('/:id', orderController.updateOrderStatus);
*/

module.exports = router;
