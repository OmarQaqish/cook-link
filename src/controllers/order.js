const Order = require('../models/order');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOneOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update order' });
  }
};

module.exports = {
  getAllOrders,
  getOneOrder,
  updateOrderStatus,
};
