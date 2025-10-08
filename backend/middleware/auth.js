// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const hdr = req.headers.authorization || '';
    const [scheme, token] = hdr.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Esperamos que el payload tenga { id, email }
    if (!decoded || !decoded.id || !decoded.email) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (e) {
    // jwt.verify lanza si está expirado o mal formado
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'No autorizado' });
  }
};
