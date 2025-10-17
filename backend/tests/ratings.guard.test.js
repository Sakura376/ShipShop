const { request, resetDb, createUser, signToken, createProduct, Order } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('bloquea rating sin compra y permite con orden paid', async () => {
  const user = await createUser({ email: 'rat@ship.shop', password: 'R4t!' });
  const token = signToken(user);
  const p = await createProduct({ quantity: 1, price: 50 });

  // Sin compra → debe fallar
  const fail = await request
    .post(`/api/products/${p.product_id}/ratings`)
    .set('Authorization', `Bearer ${token}`)
    .send({ rating: 5, comment: 'genial' });
  expect([400,403]).toContain(fail.status);

  // Compra
  const oRes = await request
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ product_id: p.product_id, quantity: 1 }] });
  const orderId = oRes.body.order_id;

  // PAGO succeed (marca paid)
  const pay = await request
    .post('/api/payments')
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', Date.now().toString())
    .send({ order_id: orderId, currency: 'USD', mock: 'succeed' });
  expect(pay.status).toBe(201);

  const order = await Order.findByPk(orderId);
  expect(order.status).toBe('paid');

  // Ahora rating debe permitir
  const ok = await request
    .post(`/api/products/${p.product_id}/ratings`)
    .set('Authorization', `Bearer ${token}`)
    .send({ rating: 4, comment: 'ok' });
  expect([200,201]).toContain(ok.status);

  // Update (upsert)
  const upd = await request
    .post(`/api/products/${p.product_id}/ratings`)
    .set('Authorization', `Bearer ${token}`)
    .send({ rating: 5, comment: 'cambie de opinión' });
  expect([200,201]).toContain(upd.status);

  const list = await request.get(`/api/products/${p.product_id}/ratings?page=1&pageSize=5`);
  expect(list.status).toBe(200);
  expect(list.body.meta).toBeTruthy();
});
