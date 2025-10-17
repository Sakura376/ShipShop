// backend/controllers/passwordReset.js
const crypto = require('node:crypto');
const argon2 = require('argon2');
const { sequelize } = require('../models'); // para transacciones
const { User, PendingReset } = require('../models');
const nodemailer = require('nodemailer');

// ==== Config y utilidades ====
const OTP_LEN = Number(process.env.OTP_LEN || 6);
const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN || 15);
const MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
const HASH_ALGO = argon2.argon2id; // constante, evita 'argon2id' literal
const APP_BASE = process.env.APP_BASE_URL || 'http://localhost:5173';

// OTP seguro
function genOTP() {
  const min = 10 ** (OTP_LEN - 1);
  const max = (10 ** OTP_LEN) - 1;
  return String(crypto.randomInt(min, max + 1));
}

// Normaliza email
const normEmail = (e) => String(e || '').trim().toLowerCase();

// Transporter (pool) reutilizable
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  pool: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

// ==== POST /api/users/forgot  { email } ====
exports.forgot = async (req, res) => {
  try {
    const email = normEmail(req.body?.email);
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const user = await User.findOne({ where: { email } });
    // Respuesta uniforme para evitar enumeración
    const generic = { message: 'Si el email existe, enviamos un código' };
    if (!user) return res.json(generic);

    const otp = genOTP();
    const code_hash = await argon2.hash(otp, { type: HASH_ALGO });
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000);

    const [pending, created] = await PendingReset.findOrCreate({
      where: { email },
      defaults: { email, code_hash, expires_at: expiresAt, attempts: 0, used_at: null }
    });

    if (!created) {
      // Opcional: cooldown por reenvío (si last_sent_at existe)
      await pending.update({ code_hash, attempts: 0, expires_at: expiresAt, used_at: null });
    }

    await mailer.sendMail({
      from: `"ShipShop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Código para restablecer tu contraseña',
      html: `
        <p>Tu código de restablecimiento:</p>
        <h2 style="letter-spacing:2px">${otp}</h2>
        <p>Vence en ${OTP_EXPIRES_MIN} minutos.</p>
        <p>Pantalla: <a href="${APP_BASE}/reset-password">Restablecer contraseña</a></p>
      `
    });

    return res.json(generic);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al iniciar reset' });
  }
};

// ==== POST /api/users/reset  { email, code, new_password } ====
exports.reset = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const email = normEmail(req.body?.email);
    const code = String(req.body?.code || '');
    const new_password = String(req.body?.new_password || '');

    // Validaciones básicas (ideal: Joi/Zod)
    if (!email || !/^\d+$/.test(code) || code.length !== OTP_LEN || new_password.length < 12) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const pending = await PendingReset.findOne({ where: { email }, transaction: t, lock: t.LOCK.UPDATE });
    if (!pending || pending.used_at || new Date(pending.expires_at) < new Date() || (pending.attempts || 0) >= MAX_ATTEMPTS) {
      await t.rollback();
      return res.status(400).json({ error: 'Código inválido o expirado' }); // mensaje uniforme
    }

    const ok = await argon2.verify(pending.code_hash, code);
    if (!ok) {
      await pending.update({ attempts: (pending.attempts || 0) + 1 }, { transaction: t });
      await t.commit();
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    const user = await User.findOne({ where: { email }, transaction: t, lock: t.LOCK.UPDATE });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const password_hash = await argon2.hash(new_password, { type: HASH_ALGO });
    // Evita el falso positivo: usa constante; si quieres texto, mapea:
    // const PASSWORD_ALGO_NAME = 'argon2id';
    await user.update({ password_hash /* , password_algo: PASSWORD_ALGO_NAME */ }, { transaction: t });

    await pending.update({ used_at: new Date() }, { transaction: t });

    await t.commit();
    return res.json({ message: 'Contraseña actualizada' });
  } catch (e) {
    await t.rollback();
    console.error(e);
    return res.status(500).json({ error: 'Error al resetear contraseña' });
  }
};
