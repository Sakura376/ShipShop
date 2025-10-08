const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const auth = require('../middleware/auth');           // Debe poner req.user { id, email }
const requireAdmin = require('../middleware/requireAdmin');
const { validateList, validateGetOrDelete, validateCreateProduct, validateUpdateProduct } = require('../validators/productValidators');

// Público (catálogo)
router.get('/', validateList, productController.list);
router.get('/:id', validateGetOrDelete, productController.getById);

// Admin (crear/editar/borrar)
router.post('/', auth, requireAdmin, validateCreateProduct, productController.create);
router.patch('/:id', auth, requireAdmin, validateUpdateProduct, productController.update);
router.delete('/:id', auth, requireAdmin, validateGetOrDelete, productController.remove);

module.exports = router;
