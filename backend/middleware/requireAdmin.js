// backend/middleware/requireAdmin.js
module.exports = (req, res, next) => {
  try {
    if (!req.user || !req.user.email) return res.status(401).json({ error: 'No autenticado' });

    const admins = String(process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const email = String(req.user.email || '').toLowerCase();
    if (!admins.includes(email)) {
      return res.status(403).json({ error: 'Requiere admin' });
    }

    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error de autorización' });
  }
};
