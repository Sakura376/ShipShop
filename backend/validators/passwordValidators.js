const { celebrate, Joi, Segments } = require('celebrate');

const email = Joi.string().email().max(254).required();
const code  = Joi.string().pattern(/^\d{6}$/).required();
const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/\d/) // opcional: mayús, minús, dígito
  .required();

exports.validateForgot = celebrate({
  [Segments.BODY]: Joi.object({ email })
});

exports.validateReset = celebrate({
  [Segments.BODY]: Joi.object({ email, code, new_password: password })
});
