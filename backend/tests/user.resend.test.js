const argon2 = require('argon2');
const { request, resetDb } = require('./helpers');
const { PendingUser } = require('../models');

beforeAll(async () => { await resetDb(); });

it('resend OTP devuelve 200 si hay pending', async () => {
  const email = 'resend@ship.shop';
  const username = 'resender';
  const password_hash = await argon2.hash('Pass1234!', { type: argon2.argon2id });
  const code_hash = await argon2.hash('111111', { type: argon2.argon2id });
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await PendingUser.create({
    email, username, password_hash, password_algo: 'argon2id',
    code_hash, attempts: 0, expires_at: expires
  });

  const res = await request.post('/api/users/resend').send({ email });
  expect(res.status).toBe(200);
  expect(res.body.message).toMatch(/Nuevo código|enviado/i);
});
