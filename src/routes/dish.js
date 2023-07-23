/* eslint-disable no-else-return */
const express = require('express');
const dishController = require('../controllers/dish');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', dishController.getDishesToGuests);
router.get(
  '/admin',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin'),
  dishController.getAllDishes
);
router.get(
  '/same-city',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('user', 'cook'),
  dishController.getDishesSameCity
);
router.get('/filter', dishController.filterDish);
router.get(
  '/mydishes',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('cook'),
  dishController.getMyDishes
);
router.get('/:id', dishController.getOneDish);
router.post(
  '/',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('cook'),
  dishController.addDish
);
router.put(
  '/:id',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin', 'cook'),
  dishController.updateDish
);
router.delete(
  '/:id',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin', 'cook'),
  dishController.removeDish
);

module.exports = router;
