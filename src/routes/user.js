const express = require('express');
const AuthController = require('../controllers/Auth');
const AuthMiddleware = require('../middlewares/auth');
const userController = require('../controllers/user');

const router = express.Router();
// handling Authentication Routes
router.post('/signin', AuthController.signIn);
router.post('/signup', AuthController.signUp);
router.post('/cook/signup', AuthController.cookSignUp);
router.get('/signout', AuthController.signOut);
// User Controllers Routes

router.get(
  '/users',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin'),
  userController.getAllUsers
);
router.put(
  '/',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin', 'user'),
  userController.updateUserProfile
);
router.put(
  '/cook/',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('admin', 'cook'),
  userController.updateCookProfile
);
module.exports = router;
