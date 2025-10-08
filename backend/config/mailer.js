// backend/config/mailer.js
const nodemailer = require('nodemailer');

async function createTransport() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true', // Mailtrap: false
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Opcional: verificar credenciales al arrancar
  if (process.env.SMTP_VERIFY === 'true') {
    try {
      await transporter.verify();
      console.log('SMTP listo para enviar');
    } catch (e) {
      console.error('SMTP verify error:', e);
    }
  }

  return transporter;
}

module.exports = createTransport;
