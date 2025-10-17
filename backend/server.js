const { app, sequelize } = require('./app');
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
