const express = require('express');
// const AuthController = require('../controllers/Auth');
const AuthMiddleware = require('../middlewares/auth');
const userController = require('../controllers/user');

const router = express.Router();
// handling Authentication Routes
// router.post('/signin', AuthController.signIn);
// router.post('/signup', AuthController.signUp);
// router.post('/cook/signup', AuthController.cookSignUp);
// router.get('/signout', AuthController.signOut);
// User Controllers Routes

router.get(
  '/users',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('admin'),
  userController.getAllUsers
);
router.put(
  '/',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('admin', 'user'),
  userController.updateUserProfile
);
router.put(
  '/cook',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('admin', 'cook'),
  userController.updateCookProfile
);

router.get('/', AuthMiddleware.protectRoute, userController.getMyInfo);
router.get('/cook-page/:id', userController.getCookPage);
router.delete('/', AuthMiddleware.protectRoute, userController.deleteMyAccount);
module.exports = router;
