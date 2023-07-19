const Cart = require('../models/cart');
const Dish = require('../models/dish');

const getCart = async (req, res) => {
  // calculateTotalPrice return in response
  const userId = req.user.id;
  try {
    const cart = await Cart.find({ user: userId })
      .populate(['dish'])
      .select({ user: 0 });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { dishId } = req.params;
    const userId = req.user.id;

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

const increaseItemQuantity = async (req, res) => {
  const { dishId } = req.params;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ user: userId, dish: dishId });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.quantity === 10) {
      return res.status(400).json({ error: 'Quantity cannot exceed 10' });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    return res.json(cartItem);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const decreaseItemQuantity = async (req, res) => {
  const { dishId } = req.params;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ user: userId, dish: dishId });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.quantity === 0) {
      return res.status(400).json({ error: 'Quantity cannot decreased' });
    }

    cartItem.quantity -= 1;
    await cartItem.save();

    return res.json(cartItem);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const removeItemFromCart = async (req, res) => {
  const { dishId } = req.params;

  try {
    await Cart.findOneAndDelete({ dish: dishId });
    return res.status(200).json({ message: 'Öğe sepetten kaldırıldı' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Bir hata oluştu, öğe sepetten kaldırılamadı' });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeItemFromCart,
};
