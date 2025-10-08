// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// --- importa auth de forma segura ---
let auth = (req, _res, next) => next(); // no-op por defecto
try {
  // si exportaste la función directamente: module.exports = (req,res,next)=>...
  const maybeFn = require('../middleware/auth');
  if (typeof maybeFn === 'function') {
    auth = maybeFn;
  } else if (maybeFn && typeof maybeFn.verify === 'function') {
    // si exportaste { verify: fn }
    auth = maybeFn.verify;
  }
} catch (_) {
  // si no existe el archivo, seguimos con no-op
}

// --- diagnóstico: imprime tipos de handlers ---
console.log('handlers:', {
  register: typeof userController.register,
  login: typeof userController.login,
  verifyEmail: typeof userController.verifyEmail,
  resendCode: typeof userController.resendCode,
  me: typeof userController.me,
  auth: typeof auth
});

// --- monta SOLO lo que exista como función ---
if (typeof userController.register === 'function') {
  router.post('/register', userController.register);
}
if (typeof userController.login === 'function') {
  router.post('/login', userController.login);
}
if (typeof userController.verifyEmail === 'function') {
  router.post('/verify', userController.verifyEmail);
}
if (typeof userController.resendCode === 'function') {
  router.post('/resend', userController.resendCode);
}
if (typeof userController.me === 'function') {
  router.get('/me', auth, userController.me);
}

module.exports = router;
