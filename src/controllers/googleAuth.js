const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

// function generateToken(user) {
//   const payload = {
//     user: {
//       id: user.id,
//       displayName: user.displayName,
//       email: user.email,
//     },
//   };

//   const options = {
//     expiresIn: '10h',
//   };
//   return jwt.sign(payload, process.env.JWT_SECRET, options);
// }

async function googleCallback(req, res, next) {
  passport.authenticate('google', async (err, profile) => {
    if (err) {
      return next(err);
    }

    try {
      let user = await User.findOne({ providerId: profile.id });

      if (!user) {
        const profilePicture =
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : null;
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          providerId: profile.id,
          profilePicture,
        });
        await user.save();
      }

      const token = user.generateAuthToken();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      res.cookie('jwt', token, { httpOnly: true });

      return res.redirect(`/?id=${userId}`);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })(req, res, next);
}

module.exports = {
  googleCallback,
};
