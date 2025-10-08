// backend/middleware/limits.js
const rateLimit = require('express-rate-limit');

exports.limitRegister = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20, // máx 20 registros por IP/15min
  standardHeaders: true,
  legacyHeaders: false
});

exports.limitLogin = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50, // login más laxo pero controlado
  standardHeaders: true,
  legacyHeaders: false
});

exports.limitResend = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10, // no spamear reenvíos
  standardHeaders: true,
  legacyHeaders: false
});
