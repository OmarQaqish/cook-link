const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    enum: ['Turkish', 'Syrian', 'Iraqi', 'Other'],
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
