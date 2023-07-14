const express = require('express');
const passport = require('../services/passport');
const googleAuthController = require('../controllers/googleAuth');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);

router.get('/google/callback', googleAuthController.googleCallback);

module.exports = router;
