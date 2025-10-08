const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, PendingUser } = require('../models');
const mailer = require('../config/mailer');


function genOTP() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}



// POST /api/users/login
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });
    email = String(email).trim();

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ error: 'Cuenta bloqueada temporalmente' });
    }

    const ok = await argon2.verify(user.password_hash, password);
    if (!ok) {
      const fails = Math.min((user.failed_login_attempts || 0) + 1, 255);
      const patch = { failed_login_attempts: fails };
      if (fails >= 5) patch.locked_until = new Date(Date.now() + 10 * 60 * 1000);
      await user.update(patch);
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    await user.update({ failed_login_attempts: 0, locked_until: null, last_login_at: new Date() });
    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token, user: { user_id: user.user_id, username: user.username, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error en login' });
  }
};

// GET /api/users/me  (requiere que auth ponga req.user.id)
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id','username','email','status','last_login_at','created_at']
    });
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error' });
  }
};


// POST /api/users/register  -> crea pending y envía OTP
exports.register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }
    email = String(email).trim();

    // Validar que NO exista usuario definitivo
    const existsUser = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
    if (existsUser) return res.status(409).json({ error: 'Usuario o email ya existe' });

    // Preparar OTP y pending
    const otp = genOTP();
    const password_hash = await argon2.hash(password, { type: argon2.argon2id });
    const code_hash = await argon2.hash(otp, { type: argon2.argon2id });
    const expiresAt = addMinutes(new Date(), Number(process.env.OTP_EXPIRES_MIN || 15));

    // Upsert en pending_users
    const [pending, created] = await PendingUser.findOrCreate({
      where: { email },
      defaults: { email, username, password_hash, password_algo: 'argon2id', code_hash, expires_at: expiresAt },
    });
    if (!created) {
      await pending.update({
        username,
        password_hash,
        password_algo: 'argon2id',
        code_hash,
        attempts: 0,
        expires_at: expiresAt,
        used_at: null,
      });
    }

    // Enviar correo con OTP
    const transport = await mailer();
    const appBase = process.env.APP_BASE_URL || 'http://localhost:5173';
    await transport.sendMail({
      from: '"ShipShop" <no-reply@shipshop.local>',
      to: email,
      subject: 'Tu código de verificación',
      html: `
        <p>Hola ${username},</p>
        <p>Tu código de verificación es:</p>
        <h2 style="letter-spacing:2px">${otp}</h2>
        <p>Vence en ${Number(process.env.OTP_EXPIRES_MIN || 15)} minutos.</p>
        <p>Ingresa el código en: <a href="${appBase}/verify-email">Verificar correo</a></p>
      `,
    });

    // ✅ Importante: NO más código de creación de usuario aquí
    return res.status(201).json({ message: 'Código enviado a tu correo. Revisa tu bandeja de entrada.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error en registro' });
  }
};

// POST /api/users/verify   { email, code }
exports.verifyEmail = async (req, res) => {
  try {
    let { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email y código requeridos' });
    email = String(email).trim();

    const pending = await PendingUser.findOne({ where: { email } });
    if (!pending) return res.status(404).json({ error: 'No hay registro pendiente' });
    if (pending.used_at) return res.status(409).json({ error: 'Este registro ya fue verificado' });
    if (new Date(pending.expires_at) < new Date()) return res.status(410).json({ error: 'Código expirado' });
    if ((pending.attempts || 0) >= 5) return res.status(423).json({ error: 'Demasiados intentos. Solicita reenvío.' });

    const ok = await argon2.verify(pending.code_hash, String(code));
    if (!ok) {
      await pending.update({ attempts: (pending.attempts || 0) + 1 });
      return res.status(400).json({ error: 'Código inválido' });
    }

    // Crear usuario definitivo
    const dup = await User.findOne({ where: { [Op.or]: [{ username: pending.username }, { email: pending.email }] } });
    if (dup) return res.status(409).json({ error: 'Usuario o email ya existe' });

    const user = await User.create({
      username: pending.username,
      email: pending.email,
      password_hash: pending.password_hash,
      password_algo: pending.password_algo || 'argon2id',
      status: 'active',
      email_verified_at: new Date(),
    });

    await pending.update({ used_at: new Date() });

    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token, user: { user_id: user.user_id, username: user.username, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error verificando correo' });
  }
};

// POST /api/users/resend   { email }
exports.resendCode = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });
    email = String(email).trim();

    const pending = await PendingUser.findOne({ where: { email } });
    if (!pending) return res.status(404).json({ error: 'No hay registro pendiente' });
    if (pending.used_at) return res.status(409).json({ error: 'Este registro ya fue verificado' });

    const otp = genOTP();
    const code_hash = await argon2.hash(otp, { type: argon2.argon2id });
    const expiresAt = addMinutes(new Date(), Number(process.env.OTP_EXPIRES_MIN || 15));
    await pending.update({ code_hash, attempts: 0, expires_at: expiresAt });

    const transport = await mailer();
    const appBase = process.env.APP_BASE_URL || 'http://localhost:5173';
    await transport.sendMail({
      from: `"ShipShop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Nuevo código de verificación',
      html: `
        <p>Tu nuevo código:</p>
        <h2 style="letter-spacing:2px">${otp}</h2>
        <p>Vence en ${Number(process.env.OTP_EXPIRES_MIN || 15)} minutos.</p>
        <p>Pantalla de verificación: <a href="${appBase}/verify-email">Verificar correo</a></p>
      `,
    });

    return res.json({ message: 'Nuevo código enviado.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error reenviando código' });
  }
};
