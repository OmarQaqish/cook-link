const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

function generateToken(user) {
  const payload = {
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
    },
  };

  const options = {
    expiresIn: '10h',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function googleCallback(req, res, next) {
  passport.authenticate('google', async (err, profile) => {
    if (err) {
      return next(err);
    }

    try {
      const user = await User.findOne({ providerId: profile.id });

      if (!user) {
        const newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          providerId: profile.id,
          type: 'user',
        });
        await newUser.save();
      }

      const token = generateToken(user);

      return res.redirect(`/?token=${token}`);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })(req, res, next);
}

module.exports = {
  googleCallback,
};
