const Order = require('../models/order');
const User = require('../models/user');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const user = await User.findById(req.user.id);

    if (user.type !== 'admin' && order.user.toString() !== user.id) {
      return res
        .status(401)
        .json({ message: 'You are not authorized to view this order' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId });

    if (!orders) {
      return res.status(404).json({ message: 'You do not have any orders' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getCookAssignedOrders = async (req, res) => {
  try {
    const assignedOrders = await Order.aggregate([
      {
        $match: {
          'items.dish._id': {
            $in: req.user.dishes,
          },
        },
      },
      {
        $addFields: {
          items: {
            $filter: {
              input: '$items',
              as: 'item',
              cond: {
                $in: ['$$item.dish._id', req.user.dishes],
              },
            },
          },
        },
      },
      {
        $project: {
          totalPrice: 0,
        },
      },
    ]);

    return res.status(200).json(assignedOrders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const permittedActions = {
      admin: ['delivered', 'canceled'],
      cook: ['pending', 'confirmed', 'prepared'],
    };
    const userType = req.user.type;
    if (!userType) {
      return res.status(401).json({ error: 'User has no type' });
    }

    if (!permittedActions[userType]) {
      return res.status(401).json({ error: 'User is not permitted' });
    }

    if (!permittedActions[userType].includes(req.body.status)) {
      return res.status(401).json({
        error: `You are not permitted to take this action. You are only permitted for these: ${permittedActions[
          userType
        ].join(', ')}`,
      });
    }

    if (userType === 'admin') {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        { status: req.body.status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json(updatedOrder);
    }

    if (userType === 'cook') {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      order.items = order.items.map((item) => {
        if (
          req.user.dishes
            .map((d) => d.toString())
            .includes(item.dish._id.toString())
        ) {
          return {
            ...item.toObject(),
            status: req.body.status,
          };
        }
        return item.toObject();
      });

      const updatedOrder = await order.save();

      return res.status(200).json(updatedOrder);
    }

    return res.status(401).json({ error: 'User type is not existed' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update order' });
  }
};

const payment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: 'This order is not assigned to you.' });
    }

    order.status = 'paid';
    await order.save();

    return res.status(200).json({ message: 'Payment is successful.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update order' });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  getMyOrders,
  updateOrderStatus,
  getCookAssignedOrders,
  payment,
};
