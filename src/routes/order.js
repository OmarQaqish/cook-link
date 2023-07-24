const express = require('express');
const orderController = require('../controllers/order');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get(
  '/',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin'),
  orderController.getAllOrders
);

router.get(
  '/assigned-orders',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('cook'),
  orderController.getCookAssignedOrders
);

router.post(
  '/payment/:orderId',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('user'),
  orderController.payment
);

router.put(
  '/:orderId',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin', 'cook'),
  orderController.updateOrderStatus
);

module.exports = router;
