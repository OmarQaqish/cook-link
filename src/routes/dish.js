const express = require('express');
const dishController = require('../controllers/dish');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', dishController.getAllDishes);
router.get('/filter', dishController.filterDish);
router.get('/:id', dishController.getOneDish);

// ************************************** protected routes
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
