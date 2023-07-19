const express = require('express');
const addressController = require('../controllers/address');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/', authMiddleware.protectRoute, addressController.addAddress);
router.get('/:id', authMiddleware.protectRoute, addressController.getAddress);
router.get(
  '/',
  authMiddleware.protectRoute,
  authMiddleware.ristrictTo('admin'),
  addressController.getAllAddresses
);
router.put(
  '/:id',
  authMiddleware.protectRoute,
  addressController.updateAddress
);
router.delete(
  '/:id',
  authMiddleware.protectRoute,
  addressController.deleteAddress
);

module.exports = router;
