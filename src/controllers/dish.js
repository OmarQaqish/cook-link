const Dish = require('../models/dish');

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    return res.status(200).json(dishes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};

const addDish = async (req, res) => {
  try {
    const { name, description, cuisine, image, price } = req.body;
    const newDish = new Dish({
      name,
      description,
      cuisine,
      image,
      price,
    });
    const savedDish = await newDish.save();
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
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    return res.status(200).json(dish);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update dish' });
  }
};

const removeDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndRemove(req.params.id);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    return res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete dish' });
  }
};

module.exports = {
  getAllDishes,
  addDish,
  filterDish,
  getOneDish,
  updateDish,
  removeDish,
};
