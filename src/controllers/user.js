const User = require('../models/user');
const Dish = require('../models/dish');
const Address = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).send(Users);
  } catch (err) {
    res.status(501).send({ message: `internal server error: ${err}` });
  }
};

const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const UserInfo = await User.findById(userId, {
      _id: 0,
      password: 0,
      createdAt: 0,
      providerId: 0,
      type: 0,
      __v: 0,
      dishes: 0,
      isAdmin: 0,
    }).populate('address', { _id: 0, __v: 0 });
    res.status(200).send(UserInfo);
  } catch (err) {
    res.status(501).send({ message: `internal server error: ${err}` });
  }
};

const getCookPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const cook = await User.findById(userId);
    if (cook.type !== 'cook') {
      return res.status(501).send({ message: 'can not get this page' });
    }
    const cookPage = await User.findById(userId, {
      _id: 0,
      password: 0,
      createdAt: 0,
      providerId: 0,
      type: 0,
      __v: 0,
      isAdmin: 0,
    })
      .populate('dishes', {
        _id: 0,
        __v: 0,
        createdAt: 0,
      })
      .populate('address', {
        _id: 0,
        __v: 0,
      });
    return res.status(200).send(cookPage);
  } catch (err) {
    return res.status(501).send({ message: `internal server error: ${err}` });
  }
};

const DeleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate('address')
      .populate('dishes');
    await Address.findByIdAndDelete(user.address.id);
    await Dish.deleteMany({ _id: { $in: user.dishes } });
    await User.findByIdAndDelete(userId);
    res.status(200).send(user);
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
  getMyInfo,
  getCookPage,
  DeleteMyAccount,
};
