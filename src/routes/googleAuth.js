const express = require('express');
const passport = require('../services/passport');
const googleAuthController = require('../controllers/googleAuth');

const router = express.Router;

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuthController.googleCallback
);

module.exports = router;
