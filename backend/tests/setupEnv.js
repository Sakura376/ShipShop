// Carga variables de test antes de levantar app/modelos
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './.env.test' });

// Mock de nodemailer para no enviar correos reales
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test' })
  })
}));
