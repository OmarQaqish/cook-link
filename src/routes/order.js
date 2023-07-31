const express = require('express');
const orderController = require('../controllers/order');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get(
  '/',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('admin'),
  orderController.getAllOrders
);

// router.get(
//   '/myorders',
//   AuthMiddleware.protectRoute,
//   AuthMiddleware.restrictTo('user', 'admin'),
//   orderController.getMyOrders
// );

router.get(
  '/assigned-orders',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('cook'),
  orderController.getCookAssignedOrders
);

router.post(
  '/payment/:orderId',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('user'),
  orderController.payment
);

router.get(
  '/:orderId',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('user', 'admin'),
  orderController.getOrder
);

router.put(
  '/:orderId',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('admin', 'cook'),
  orderController.updateOrderStatus
);

module.exports = router;
