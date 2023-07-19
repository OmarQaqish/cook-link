const User = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).send(Users);
  } catch (err) {
    res.status(501).send({ message: `internal server error: ${err}` });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      password2,
      profilePicture,
    } = req.body;
    const userId = req.user.id;
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (password !== password2) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }
    // Update the user profile fields
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.profilePicture = profilePicture;

    // Save the updated user profile
    await user.save();
    return res
      .status(200)
      .send({ message: 'User profile updated successfully', user });
  } catch (err) {
    return res.status(501).send({ message: `internal server error: ${err}` });
  }
};

const updateCookProfile = async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      password2,
      profilePicture,
      location,
      bio,
    } = req.body;
    const userId = req.user.id;
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (password !== password2) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }
    // Update the cook profile fields
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.profilePicture = profilePicture;
    user.location = location;
    user.bio = bio;

    // Save the updated user profile
    await user.save();
    return res
      .status(200)
      .send({ message: 'Cook profile updated successfully', user });
  } catch (err) {
    return res.status(501).send({ message: `internal server error: ${err}` });
  }
};

module.exports = {
  getAllUsers,
  updateUserProfile,
  updateCookProfile,
};
