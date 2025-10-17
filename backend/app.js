if (process.env.NODE_ENV !== 'test') require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors: celebrateErrors } = require('celebrate');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const sequelize = require('./config/db');
require('./models');

// Rutas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderAdminRoutes = require('./routes/orderAdminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.set('trust proxy', 1);

// Seguridad y CORS
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Body parser con límite
app.use(express.json({ limit: '256kb' }));

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Rate limit global suave
app.use('/api/', rateLimit({ windowMs: 15*60*1000, limit: 1000, standardHeaders: true, legacyHeaders: false }));

// Swagger (no falla si el YAML no está en test)
try {
  const openapi = YAML.load('./docs/openapi.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));
} catch { /* noop en test */ }

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', orderAdminRoutes);
app.use('/api/payments', paymentRoutes);

// Errores de Celebrate/Joi
app.use(celebrateErrors());

// Manejador de errores global
app.use((err, req, res, _next) => {
  console.error('Error handler:', err);
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = status >= 500 ? 'Error interno' : (err.message || 'Error');
  res.status(status).json({ error: message, code });
});

module.exports = { app, sequelize };
