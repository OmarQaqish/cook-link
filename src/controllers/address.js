const Address = require('../models/address');
const User = require('../models/user');

const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const user = await User.findById(userId);
    // Check if the user's address is the same one as the address in the request
    if (
      user.type !== 'admin' &&
      (!user.address || user.address.toString() !== addressId)
    ) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to access this address' });
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
    // With this check, the user is allowed to add an address only if they don't have one.
    // If they delete the address, they can add an address again
    if (req.user.address) {
      return res.status(400).json({ message: 'You already have an address' });
    }
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
    req.user.address = savedAddress.id;
    await req.user.save();

    return res
      .status(201)
      .json({ message: 'Address added successfully', address: savedAddress });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add address' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const user = await User.findById(userId);
    if (
      user.type !== 'admin' &&
      (!user.address || user.address.toString() !== addressId)
    ) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to update this address' });
    }

    const updatedFields = req.body;
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      updatedFields,
      { new: true }
    );

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
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    const user = await User.findById(userId);
    if (
      user.type !== 'admin' &&
      (!user.address || user.address.toString() !== addressId)
    ) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this address' });
    }

    // Find the user whose address we want to delete and set their address field to null
    const updatedUser = await User.findOneAndUpdate(
      { address: addressId },
      { $set: { address: null } }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found for this address' });
    }

    // Remove the address from the database
    await Address.deleteOne({ _id: addressId });
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
