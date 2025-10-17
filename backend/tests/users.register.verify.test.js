const argon2 = require('argon2');
const { request, resetDb } = require('./helpers');
const { PendingUser, User } = require('../models');

beforeAll(async () => { await resetDb(); });

it('verifica OTP y crea usuario definitivo', async () => {
  const email = 'verify@ship.shop';
  const username = 'verifyUser';
  const otp = '654321';
  const password_hash = await argon2.hash('SuperSecreto123!', { type: argon2.argon2id });
  const code_hash = await argon2.hash(otp, { type: argon2.argon2id });
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await PendingUser.create({
    email, username, password_hash, password_algo: 'argon2id',
    code_hash, attempts: 0, expires_at: expires, used_at: null
  });

  const res = await request.post('/api/users/verify').send({ email, code: otp });
  expect(res.status).toBe(200);
  expect(res.body.token).toBeTruthy();

  const user = await User.findOne({ where: { email } });
  expect(user).toBeTruthy();
  expect(user.status).toBe('active');
  expect(user.email_verified_at).toBeTruthy();
});
