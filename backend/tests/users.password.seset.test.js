const argon2 = require('argon2');
const { request, resetDb, createUser } = require('./helpers');
const { PendingReset, User } = require('../models');

beforeAll(async () => { await resetDb(); });

it('reset de contraseña con OTP válido', async () => {
  const email = 'reset@ship.shop';
  await createUser({ email, password: 'ViejaClave123!' });

  const otp = '123456';
  const code_hash = await argon2.hash(otp, { type: argon2.argon2id });
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await PendingReset.create({ email, code_hash, attempts: 0, expires_at: expires });

  const res = await request.post('/api/users/reset').send({
    email, code: otp, new_password: 'NuevaClave123!'
  });
  expect(res.status).toBe(200);

  const login = await request.post('/api/users/login').send({ email, password: 'NuevaClave123!' });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();
});
