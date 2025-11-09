if (process.env.NODE_ENV !== 'test') require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors: celebrateErrors } = require('celebrate');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const sequelize = require('./config/db');   // instancia de Sequelize (config/db.js)
require('./models');                        // registra modelos y asociaciones

// Rutas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderAdminRoutes = require('./routes/orderAdminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Controller para webhook (se usa con express.raw)
const { webhook: paymentWebhook } = require('./controllers/paymentController');

const app = express();
app.set('trust proxy', 1);

// ========= Seguridad básica y CORS =========
app.use(helmet());

// Soporta CORS_ORIGINS (coma-separado) o CORS_ORIGIN (uno solo)
const allowed = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ========= Rate limit global =========
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 1000),
  standardHeaders: true,
  legacyHeaders: false
}));

// ========= Health =========
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Health DB real
app.get('/api/db/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ db: 'ok' });
  } catch (e) {
    res.status(500).json({ db: 'down', error: e.message });
  }
});

// ========= Webhook RAW (antes del json()) =========
// IMPORTANTE: este endpoint debe declararse ANTES de app.use(express.json())
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentWebhook);

// ========= Body parser para el resto de rutas =========
app.use(express.json({ limit: '256kb' }));

// ========= Swagger =========
try {
  const openapi = YAML.load('./docs/openapi.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));
} catch {
  // noop en test o si no existe el YAML
}

// ========= Rutas de la API =========
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', orderAdminRoutes);
app.use('/api/payments', paymentRoutes);

// ========= Errores de Celebrate/Joi =========
app.use(celebrateErrors());

// ========= 404 (después de todas las rutas) =========
app.use((req, res, _next) => {
  res.status(404).json({ error: 'Not Found' });
});

// ========= Manejador de errores global =========
app.use((err, req, res, _next) => {
  console.error('Error handler:', err);
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = status >= 500 ? 'Error interno' : (err.message || 'Error');
  res.status(status).json({ error: message, code });
});

module.exports = { app, sequelize };
