const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreateOrUpdateRating = celebrate({
  [Segments.PARAMS]: Joi.object({ id: Joi.number().integer().min(1).required() }), // product_id
  [Segments.BODY]: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).allow('', null),
  }),
});

exports.validateListRatings = celebrate({
  [Segments.PARAMS]: Joi.object({ id: Joi.number().integer().min(1).required() }),
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
  }),
});
