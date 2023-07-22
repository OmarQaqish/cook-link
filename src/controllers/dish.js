/* eslint-disable no-else-return */
const Dish = require('../models/dish');
const User = require('../models/user');

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    return res.status(200).json({ message: 'admin', dishes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};
const getDishesSameCity = async (req, res) => {
  try {
    const dishes = await Dish.find();
    return res.status(200).json({ message: 'customer', dishes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};
const getDishesToGuests = async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 }).limit(10);
    return res.status(200).json({ message: 'guest', dishes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};

const addDish = async (req, res) => {
  try {
    const { name, description, cuisine, image, price } = req.body;
    const cookId = req.user.id;
    if (!name) {
      return res.status(401).json({
        message: 'please add a dish name',
      });
    }
    const newDish = new Dish({
      name,
      description,
      cuisine,
      image,
      price,
    });
    const savedDish = await newDish.save();

    await User.findByIdAndUpdate(cookId, { $push: { dishes: savedDish.id } });

    return res.status(201).json(savedDish);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add dish' });
  }
};

const filterDish = async (req, res) => {
  try {
    const { cuisine } = req.body;
    const filteredDishes = await Dish.find({ cuisine });

    return res.status(200).json({ dishes: filteredDishes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to filter dishes' });
  }
};

const getOneDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    return res.status(200).json(dish);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dish' });
  }
};

const updateDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const updateFields = req.body;
    // Define the allowed fields that can be updated
    const allowedFields = ['name', 'description', 'cuisine', 'image', 'price'];
    const userId = req.user.id;
    const user = await User.findById(userId);
    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    // Check if any of the fields in the request body are not allowed
    const invalidFields = Object.keys(updateFields).filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields found: ${invalidFields.join(', ')}`,
      });
    }
    // allow all admins and just the owner of the dishes to update
    if (
      user.type !== 'admin' &&
      (!user.dishes || !user.dishes.includes(dishId))
    ) {
      return res.status(403).json({
        error: 'You do not have permission to UPDATE this dish',
      });
    }

    const updatedDish = await Dish.findByIdAndUpdate(dishId, updateFields, {
      new: true,
    });
    return res.status(200).json(updatedDish);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update dish' });
  }
};

const removeDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // allow all admins and just the owner of the dishes to delete
    if (
      user.type !== 'admin' &&
      (!user.dishes || !user.dishes.includes(dishId))
    ) {
      return res.status(403).json({
        error: 'You do not have permission to DELETE this dish',
      });
    }
    const dishOwner = await User.findOne({ dishes: dishId });
    await Dish.findByIdAndRemove(req.params.id);
    await User.findByIdAndUpdate(dishOwner.id, { $pull: { dishes: dishId } });
    return res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete dish' });
  }
};

const getMyDishes = async (req, res) => {
  try {
    const userId = req.user.id;
    const cook = await User.findById(userId);
    const dishIds = cook.dishes;
    if (dishIds.length === 0) {
      return res.status(200).json({ message: 'you  have no any dishes yet' });
    }
    const nyDishes = await Dish.find({ _id: { $in: dishIds } });
    return res.status(200).json(nyDishes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};
module.exports = {
  getAllDishes,
  getDishesSameCity,
  getDishesToGuests,
  addDish,
  filterDish,
  getOneDish,
  updateDish,
  removeDish,
  getMyDishes,
};
