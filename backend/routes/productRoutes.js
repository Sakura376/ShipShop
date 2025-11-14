const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { 
  validateList, 
  validateGetOrDelete, 
  validateCreateProduct, 
  validateUpdateProduct 
} = require('../validators/productValidators');
const { 
  validateCreateOrUpdateRating, 
  validateListRatings 
} = require('../validators/ratingValidators');

// 🔍 Búsqueda por nombre (IMPORTANTE: antes de '/:id')
router.get('/search', productController.searchByName);

// Público (catálogo)
router.get('/', validateList, productController.list);
router.get('/:id', validateGetOrDelete, productController.getById);

// Ratings
router.get('/:id/ratings', validateListRatings, ratingController.listForProduct);
router.post('/:id/ratings', auth, validateCreateOrUpdateRating, ratingController.upsertMyRating);

// Admin (crear/editar/borrar)
router.post('/', auth, requireAdmin, validateCreateProduct, productController.create);
router.patch('/:id', auth, requireAdmin, validateUpdateProduct, productController.update);
router.delete('/:id', auth, requireAdmin, validateGetOrDelete, productController.remove);

module.exports = router;
