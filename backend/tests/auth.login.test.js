const { request, resetDb, createUser } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('login retorna token con credenciales válidas', async () => {
  const user = await createUser({ email: 'cap@ship.shop', password: 'Secr3to!' });
  const res = await request.post('/api/users/login').send({ email: user.email, password: 'Secr3to!' });
  expect(res.status).toBe(200);
  expect(res.body.token).toBeTruthy();
});
