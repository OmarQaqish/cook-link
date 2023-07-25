const express = require('express');
const authController = require('../controllers/Auth');

const router = express.Router();

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/cook/signup', authController.cookSignUp);
router.get('/signout', authController.signOut);

module.exports = router;
