const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

// POST /api/users/register
exports.register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Campos requeridos' });
    email = String(email).trim();

    const exists = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
    if (exists) return res.status(409).json({ error: 'Usuario o email ya existe' });

    const password_hash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await User.create({ username, email, password_hash, password_algo: 'argon2id', status: 'active' });

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(201).json({ token, user: { user_id: user.user_id, username, email } });
  } catch (e) {
    console.error(e); res.status(500).json({ error: 'Error en registro' });
  }
};

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
      if (fails >= 5) patch.locked_until = new Date(Date.now() + 10*60*1000);
      await user.update(patch);
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    await user.update({ failed_login_attempts: 0, locked_until: null, last_login_at: new Date() });
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { user_id: user.user_id, username: user.username, email: user.email } });
  } catch (e) {
    console.error(e); res.status(500).json({ error: 'Error en login' });
  }
};

// GET /api/users/me   (requiere Bearer token)
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id','username','email','status','last_login_at','created_at']
    });
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Error' });
  }
};
