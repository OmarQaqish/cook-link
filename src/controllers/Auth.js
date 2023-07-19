/* eslint-disable prefer-destructuring */
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// ********************************* SignIn controller
const signIn = async (req, res) => {
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
    res.cookie('jwt', token, { httpOnly: true });
    return res
      .status(201)
      .send({ JWTtoken: token, message: 'Logged in successfully' });
  } catch (err) {
    return res.status(501).send({ message: 'crapp internal server error' });
  }
};

// ******************************************************************* SignUp controller
const signUp = async (req, res) => {
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

const signOut = (req, res) => {
  try {
    res.clearCookie('jwt'); // Clear the JWT cookie
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).send({ message: `failed to log out: ${err}` });
  }
};

module.exports = {
  signIn,
  signUp,
  cookSignUp,
  signOut,
};
