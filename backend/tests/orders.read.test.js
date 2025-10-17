// tests/orders.read.test.js
const { request, resetDb, createUser, signToken, createProduct } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('usuario ve su listado y detalle de órdenes', async () => {
  const user = await createUser({ email: 'buyer@ship.shop', password: 'Compr4!' });
  const token = signToken(user);
  const p = await createProduct({ quantity: 2, price: 10 });

  // Crea una orden
  const create = await request
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ product_id: p.product_id, quantity: 2 }] });

  expect([200, 201]).toContain(create.status);
  const createdId =
    create.body.order_id ??
    create.body.id ??
    create.body.order?.order_id;
  expect(createdId).toBeTruthy();

  // Listado (acepta varias formas de respuesta)
  const list = await request
    .get('/api/orders')
    .set('Authorization', `Bearer ${token}`);

  expect(list.status).toBe(200);

  const arr =
    list.body.items ??
    list.body.orders ??
    list.body.data ??
    list.body.rows ??
    (Array.isArray(list.body) ? list.body : undefined);

  expect(Array.isArray(arr)).toBe(true);

  // Detalle (acepta varias claves para el id)
  const detail = await request
    .get(`/api/orders/${createdId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(detail.status).toBe(200);

  const gotId =
    detail.body.order_id ??
    detail.body.id ??
    detail.body.order?.order_id;

  expect(gotId).toBe(createdId);
});
