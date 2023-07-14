const express = require('express');
const AuthController = require('../controllers/Auth');
const userController = require('../controllers/user');

const router = express.Router();
// handling Authentication Routes
router.post('/signin', AuthController.SignIn);
router.post('/signup', AuthController.SignUp);
router.post('/cook/signup', AuthController.cookSignUp);
router.get('/signout', AuthController.SignOut);
// User Controllers Routes
router.get(
  '/users',
  AuthController.protectRoute,
  AuthController.ristrictTo('admin'),
  userController.getAllUsers
);
// router.get('/profile/:id', userController.getUserProfile);
// router.put('/profile/:id', userController.updateUserProfile);
// router.get('/signout', userController.logoutUser);
// router.get('/authenticated', userController.homePageUser);
module.exports = router;
