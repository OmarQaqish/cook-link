const User = require('../models/user');

const getAllUsers = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).send(Users);
  } catch (err) {
    res.status(501).send({ message: `faild to get users: ${err}` });
  }
};

module.exports = {
  getAllUsers,
};
