const { celebrate, Joi, Segments } = require('celebrate');

exports.validateCreatePayment = celebrate({
  [Segments.BODY]: Joi.object({
    order_id: Joi.number().integer().min(1).required(),
    currency: Joi.string().max(10).default('USD'),
    // Modo mock opcional: "succeed" | "fail" | "process"
    mock: Joi.string().valid('succeed','fail','process').default('succeed')
  })
});
