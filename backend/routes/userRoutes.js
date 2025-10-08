 const express = require('express');
 const router = express.Router();
 const userController = require('../controllers/userController');
 const auth = require('../middleware/auth'); // asumiendo que exporta una función
const { validateRegister, validateLogin, validateVerify, validateResend } = require('../validators/userValidators');
const { limitRegister, limitLogin, limitResend } = require('../middleware/limits');

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

 // Perfil
 router.get('/me', auth, userController.me);

 module.exports = router;
