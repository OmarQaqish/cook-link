const Cart = require('../models/cart');
const Dish = require('../models/dish');

const getCart = async (req, res) => {
  // calculateTotalPrice return in response
  try {
    const cart = await Cart.find();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { userId, quantity } = req.body;
    const { dishId } = req.params;

    const isDishExist = await Dish.count({ _id: dishId });

    if (!isDishExist) {
      return res.status(500).json({ error: 'Failed to find dish' });
    }

    const existingCart = await Cart.findOne({
      user: userId,
      dish: dishId,
    });

    if (!existingCart) {
      const newCart = new Cart({
        user: userId,
        dish: dishId,
        quantity,
      });

      const savedCart = await newCart.save();
      return res.status(201).json(savedCart);
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: existingCart.id },
      { $set: { quantity } },
      { new: true }
    );
    return res.status(201).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add cart' });
  }
};

module.exports = {
  getCart,
  addItemToCart,
};
