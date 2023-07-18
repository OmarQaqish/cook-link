const Address = require('../models/address');

const getAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    return res.status(200).json(address);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch address' });
  }
};

const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    return res.status(201).json(addresses);
  } catch (error) {
    return res.status(404).json({ error: 'Failed to fetch addresses' });
  }
};

const addAddress = async (req, res) => {
  try {
    const {
      street,
      buildingNumber,
      apartmentNumber,
      neighborhood,
      district,
      city,
      country,
      postalCode,
    } = req.body;
    const newAddress = new Address({
      street,
      buildingNumber,
      apartmentNumber,
      neighborhood,
      district,
      city,
      country,
      postalCode,
    });
    const savedAddress = await newAddress.save();
    return res
      .status(201)
      .json({ message: 'Address added successfully', address: savedAddress });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add address' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }
    return res.status(201).json({
      message: 'Address updated successfully',
      address: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update address' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }
    return res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete address' });
  }
};

module.exports = {
  getAddress,
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
