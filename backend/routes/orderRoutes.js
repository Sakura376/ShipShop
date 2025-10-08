const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');
const { validateCreateOrder } = require('../validators/orderValidators');

router.post('/', auth, validateCreateOrder, orderController.create); // crear orden (validado)
router.get('/', auth, orderController.listMine);     // mis órdenes
router.get('/:id', auth, orderController.getMine);   // detalle de mi orden

module.exports = router;
