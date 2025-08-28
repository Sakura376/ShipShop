require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB conectada');
    app.listen(PORT, () => console.log(`🚀 Backend en http://localhost:${PORT}`));
  } catch (e) {
    console.error('❌ Error DB:', e);
    process.exit(1);
  }
})();
