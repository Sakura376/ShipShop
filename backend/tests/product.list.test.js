const { request, resetDb, createProduct } = require('./helpers');

beforeAll(async () => {
  await resetDb();
  await createProduct({ title: 'Falcon 9', price: 10 });
  await createProduct({ title: 'Falcon Heavy', price: 20 });
});

it('listado de productos paginado', async () => {
  const res = await request.get('/api/products?page=1&pageSize=10&sort=price&dir=ASC');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.items)).toBe(true);
});
