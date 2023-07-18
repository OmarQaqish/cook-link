const express = require('express');
const addressController = require('../controllers/address');

const router = express.Router();

router.post('/', addressController.addAddress);
router.get('/:id', addressController.getAddress);
router.get('/', addressController.getAllAddresses);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
