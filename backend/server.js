// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors: celebrateErrors } = require('celebrate');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openapi = YAML.load('./docs/openapi.yaml'); // <-- ruta relativa a server.js
const paymentRoutes = require('./routes/paymentRoutes');

const sequelize = require('./config/db');
require('./models'); // carga modelos y relaciones

// Rutas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderAdminRoutes = require('./routes/orderAdminRoutes');

const app = express();

// Si corres detrás de proxy (NGINX/Render/Heroku), habilita trust proxy para rate-limit/IPs reales
app.set('trust proxy', 1);

// Seguridad y CORS
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Body parser con límite
app.use(express.json({ limit: '256kb' }));

// Healthcheck simple
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// Rate limit global suave para /api/*
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Rate limit global suave para /api/*
app.use('/api/', rateLimit({ windowMs: 15*60*1000, limit: 1000, standardHeaders: true, legacyHeaders: false }));

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Montaje de rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', orderAdminRoutes);
app.use('/api/payments', paymentRoutes);

// Errores de Celebrate/Joi (debe ir después de las rutas)
app.use(celebrateErrors());

// Manejador de errores global (último middleware)
app.use((err, req, res, _next) => {
  console.error('Error handler:', err);
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = status >= 500 ? 'Error interno' : err.message || 'Error';
  res.status(status).json({ error: message, code });
});

// Inicio del servidor
const PORT = process.env.PORT || 3001;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');
    app.listen(PORT, () => console.log(`Backend en http://localhost:${PORT}`));
  } catch (e) {
    console.error('Error DB:', e);
    process.exit(1);
  }
})();
