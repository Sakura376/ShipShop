 require('dotenv').config();
 const express = require('express');
 const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors: celebrateErrors } = require('celebrate');

 const sequelize = require('./config/db');
 require('./models');

 const userRoutes = require('./routes/userRoutes');
 const productRoutes = require('./routes/productRoutes');

 const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
// Si desplegarás detrás de proxy (NGINX/Render/Heroku), habilita trust proxy para rate-limit
app.set('trust proxy', 1);

// Seguridad HTTP
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Tamaño máximo del body
app.use(express.json({ limit: '256kb' }));

 // Health
 app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
 
// Rutas
// Rate limit global suave (opcional)
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000, // suficientemente alto para no molestar, pero evita floods
  standardHeaders: true,
  legacyHeaders: false,
}));

// Rutas
 app.use('/api/users', userRoutes);
 app.use('/api/products', productRoutes);

// Errores de Celebrate/Joi
app.use(celebrateErrors());

// Manejador de errores global (último middleware)
// Para cualquier next(err) o throw no capturado en controladores
app.use((err, req, res, _next) => {
  // Log mínimo (ajusta a pino/winston si quieres)
  console.error('Error handler:', err);
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  // No exponer detalles sensibles en prod
  const message = status >= 500 ? 'Error interno' : (err.message || 'Error');
  res.status(status).json({ error: message, code });
});

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
