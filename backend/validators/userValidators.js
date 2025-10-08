// backend/validators/userValidators.js
const { celebrate, Joi, Segments } = require('celebrate');

const email = Joi.string().email().max(254).required();
const username = Joi.string().min(3).max(50).required();
const password = Joi.string().min(8).max(128).required();
const code = Joi.string().pattern(/^\d{6}$/).required();

exports.validateRegister = celebrate({
  [Segments.BODY]: Joi.object({ username, email, password })
});

exports.validateLogin = celebrate({
  [Segments.BODY]: Joi.object({ email, password })
});

exports.validateVerify = celebrate({
  [Segments.BODY]: Joi.object({ email, code })
});

exports.validateResend = celebrate({
  [Segments.BODY]: Joi.object({ email })
});
