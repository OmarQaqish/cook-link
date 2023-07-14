/* eslint-disable prefer-destructuring */
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ******************************************************************* SignIn controller
const SignIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword || !user) {
      return res.status(400).send({ message: 'Wrong username or password' });
    }

    const token = user.generateAuthToken();

    return res
      .status(201)
      .send({ JWTtoken: token, message: 'Logged in successfully' });
  } catch (err) {
    return res.status(501).send({ message: 'crapp internal server error' });
  }
};

// ******************************************************************* SignUp controller
const SignUp = async (req, res) => {
  const { username, firstName, lastName, email, password, password2 } =
    req.body;
  try {
    if (password !== password2) {
      return res.status(400).send({ message: 'passwords do not match' });
    }
    const checkUserEmail = await User.findOne({ email: req.body.email });
    const checkUserName = await User.findOne({ username: req.body.username });
    if (checkUserEmail || checkUserName) {
      return res
        .status(400)
        .send({ message: 'user email or username already exist' });
    }
    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    return res
      .status(201)
      .send({ message: 'user created successfully', data: newUser });
  } catch (err) {
    return res.status(501).send({ message: 'crap internal server error' });
  }
};
// ******************************************************* cook signup
const cookSignUp = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    password2,
    location,
    bio,
  } = req.body;
  try {
    if (password !== password2) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }

    const checkUserEmail = await User.findOne({ email });
    const checkUserName = await User.findOne({ username });

    if (checkUserEmail || checkUserName) {
      return res
        .status(400)
        .send({ message: 'User email or username already exists' });
    }
    if (!location || !bio) {
      return res.status(400).send({ message: 'location and bio are required' });
    }
    const newCook = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      type: 'cook',
      location,
      bio,
    });

    return res
      .status(201)
      .send({ message: 'Cook created successfully', newCook });
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

// ********************************************************** signout controller

const SignOut = (req, res) => {
  try {
    // implement Sign out
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).send({ message: `failed to log out: ${err}` });
  }
};

// ******************************************************* Authentication protectRoute controller
const protectRoute = async (req, res, next) => {
  // 1.getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res
      .status(403)
      .send({ message: 'you are not logged in, please log in to get access' });
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
  // 4. check if the user changed password after the token is issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return res
      .status(401)
      .send({ message: 'user recently changed password, log in again' });
  }

  // grant access to protected route
  req.user = freshUser;
  return next();
};

// ******************************************************* Authoraization ristrictTo controller
const ristrictTo =
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
  SignIn,
  SignUp,
  protectRoute,
  ristrictTo,
  cookSignUp,
  SignOut,
};
