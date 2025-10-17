const supertest = require('supertest');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { app, sequelize } = require('../app');
const { User, Product, Order } = require('../models');

const request = supertest(app);

async function resetDb() {
  await sequelize.sync({ force: true }); // crea todas las tablas en SQLite memory
}

async function createUser({ email, username, password='Passw0rd!' }) {
  const uniq = 'u' + Math.random().toString(16).slice(2); // <- genera algo único
  const finalUsername = username || `tester_${uniq}`;      // <- usa si no te pasan username

  const password_hash = await argon2.hash(password, { type: argon2.argon2id });
  return User.create({
    email,
    username: finalUsername,
    password_hash,
    password_algo: 'argon2id',
    status: 'active',
    email_verified_at: new Date()
  });
}


function signToken(user) {
  return jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

async function createProduct(overrides = {}) {
  return Product.create({
    sku: 'SKU-' + Math.random().toString(16).slice(2),
    title: 'Test Rocket',
    price: 1000.00,
    quantity: 5,
    is_active: true,
    ...overrides
  });
}

module.exports = { app, sequelize, request, resetDb, createUser, signToken, createProduct, Order };
