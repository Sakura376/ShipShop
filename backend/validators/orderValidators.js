// backend/validators/orderValidators.js
const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.number().integer().min(1).required(),
        quantity: Joi.number().integer().min(1).required(),
        // Opcional: si lo mandas, debe ser número válido.
        unit_price: Joi.number().precision(2).min(0).optional()
      })
    ).min(1).required()
  })
});
