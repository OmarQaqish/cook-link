const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  dish: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Quantity cannot exceed 10'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'prepared'],
    default: 'pending',
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'paid', 'delivered', 'canceled'],
    default: 'waiting',
    required: true,
  },
});

// This is to calculate the total price of the order by multiplying the quantity of the item with the price of the dish that is taken from the dish model.
orderSchema.pre('save', function (next) {
  const totalPrice = this.items.reduce(
    (sum, item) => sum + item.quantity * item.dish.price,
    0
  );
  this.totalPrice = totalPrice;
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
