const mongoose = require('mongoose');

// For reference: neighborhood is mahalle and district is semt/ilce in this case.
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  buildingNumber: {
    type: Number,
    required: true,
  },
  apartmentNumber: {
    type: Number,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: 'Turkey',
  },
  postalCode: {
    type: Number,
    required: true,
  },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
