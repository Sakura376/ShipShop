 const express = require('express');
 const router = express.Router();
 const userController = require('../controllers/userController');
 const auth = require('../middleware/auth'); // asumiendo que exporta una función
const { validateRegister, validateLogin, validateVerify, validateResend } = require('../validators/userValidators');
const { limitRegister, limitLogin, limitResend } = require('../middleware/limits');
const { validateForgot, validateReset } = require('../validators/passwordValidators');
const rateLimit = require('express-rate-limit');
const passwordResetController = require('../controllers/passwordResetController');

// limits específicos
const limitForgot = rateLimit({ windowMs: 15*60*1000, limit: 5, standardHeaders:true, legacyHeaders:false });
const limitReset  = rateLimit({ windowMs: 15*60*1000, limit: 10, standardHeaders:true, legacyHeaders:false });
// Registro y autenticación
router.post('/register', userController.register);
router.post('/login',    userController.login);
router.post('/verify',   userController.verifyEmail);
router.post('/resend',   userController.resendCode);
// Registro y autenticación (con límites + validación)
router.post('/register', limitRegister, validateRegister, userController.register);
router.post('/login',    limitLogin,    validateLogin,    userController.login);
router.post('/verify',                   validateVerify,   userController.verifyEmail);
router.post('/resend',   limitResend,   validateResend,   userController.resendCode);
// Recuperacion de contrasenas
router.post('/forgot',  limitForgot,   validateForgot,   passwordResetController.forgot);
router.post('/reset',   limitReset,    validateReset,    passwordResetController.reset);

 // Perfil
 router.get('/me', auth, userController.me);

 module.exports = router;
