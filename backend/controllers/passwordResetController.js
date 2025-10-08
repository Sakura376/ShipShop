const argon2 = require('argon2');
const { Op } = require('sequelize');
const { User, PendingReset } = require('../models');
const nodemailer = require('nodemailer');

function genOTP(){ return String(Math.floor(100000 + Math.random()*900000)); }
function addMinutes(date, m){ return new Date(date.getTime() + m*60000); }

async function mailer(){
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

// POST /api/users/forgot  { email }
exports.forgot = async (req, res) => {
  try {
    let { email } = req.body;
    email = String(email).trim();

    const user = await User.findOne({ where: { email } });
    // Por seguridad, responde igual aunque no exista
    if (!user) return res.json({ message: 'Si el email existe, enviamos un código' });

    const otp = genOTP();
    const code_hash = await argon2.hash(otp, { type: argon2.argon2id });
    const expiresAt = addMinutes(new Date(), Number(process.env.OTP_EXPIRES_MIN || 15));

    const [pending, created] = await PendingReset.findOrCreate({
      where: { email },
      defaults: { email, code_hash, expires_at: expiresAt }
    });
    if (!created){
      await pending.update({ code_hash, attempts: 0, expires_at: expiresAt, used_at: null });
    }

    const transport = await mailer();
    const appBase = process.env.APP_BASE_URL || 'http://localhost:5173';
    await transport.sendMail({
      from: `"ShipShop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Código para restablecer tu contraseña',
      html: `
        <p>Tu código de restablecimiento:</p>
        <h2 style="letter-spacing:2px">${otp}</h2>
        <p>Vence en ${Number(process.env.OTP_EXPIRES_MIN || 15)} minutos.</p>
        <p>Pantalla: <a href="${appBase}/reset-password">Restablecer contraseña</a></p>
      `
    });

    return res.json({ message: 'Si el email existe, enviamos un código' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al iniciar reset' });
  }
};

// POST /api/users/reset  { email, code, new_password }
exports.reset = async (req, res) => {
  try {
    let { email, code, new_password } = req.body;
    email = String(email).trim();

    const pending = await PendingReset.findOne({ where: { email } });
    if (!pending) return res.status(400).json({ error: 'Código no solicitado' });
    if (pending.used_at) return res.status(409).json({ error: 'Código ya usado' });
    if (new Date(pending.expires_at) < new Date()) return res.status(410).json({ error: 'Código expirado' });
    if ((pending.attempts || 0) >= 5) return res.status(423).json({ error: 'Demasiados intentos. Solicita otro.' });

    const ok = await argon2.verify(pending.code_hash, String(code));
    if (!ok){
      await pending.update({ attempts: (pending.attempts || 0) + 1 });
      return res.status(400).json({ error: 'Código inválido' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const password_hash = await argon2.hash(new_password, { type: argon2.argon2id });
    await user.update({ password_hash, password_algo: 'argon2id' });

    await pending.update({ used_at: new Date() });

    return res.json({ message: 'Contraseña actualizada' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al resetear contraseña' });
  }
};
