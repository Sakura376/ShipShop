const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const orderAdminController = require('../controllers/orderAdminController');

router.patch('/:id/status', auth, requireAdmin, orderAdminController.updateStatus);

module.exports = router;
