const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Quantity cannot exceed 10'],
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
});

// Calculate the total price based on the cart items
cartSchema.pre('save', function (next) {
  const totalPrice = this.items.reduce(
    (sum, item) => sum + item.quantity * item.dish.price,
    0
  );
  this.totalPrice = totalPrice;
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
