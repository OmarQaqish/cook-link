/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// *********************************** Authentication protectRoute controller
const protectRoute = async (req, res, next) => {
  try {
    // 1.getting token and check if it's there
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(403).send({
        message: 'you are not logged in, please log in to get access',
      });
    }
    // 2. verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. check if user still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res
        .status(401)
        .send({ message: "the user of this token doesn't exists" });
    }

    // grant access to protected route
    req.user = freshUser;
    return next();
  } catch (err) {
    return res.status(500).send({ message: `Internal server error: ${err}` });
  }
};

// ********************************************** Authoraization restrictTo controller

const restrictTo =
  (...type) =>
  (req, res, next) => {
    if (!type.includes(req.user.type)) {
      return res
        .status(403) // forbidden
        .send({ message: 'you do not have permission to perform this action' });
    }
    return next();
  };

module.exports = {
  protectRoute,
  restrictTo,
};
