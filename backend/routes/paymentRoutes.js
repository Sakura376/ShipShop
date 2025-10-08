const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateCreatePayment } = require('../validators/paymentValidators');
const paymentController = require('../controllers/paymentController');

// Crea intento de pago (mock). Requiere header Idempotency-Key.
router.post('/', auth, validateCreatePayment, paymentController.createPayment);

// Webhook simulado del proveedor (usa firma secreta)
router.post('/webhook', express.json(), paymentController.webhook);

module.exports = router;
