const { request, resetDb, createUser, signToken, createProduct, Order } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('payment succeed → orden paid', async () => {
  const user = await createUser({ email: 'pay@ship.shop', password: 'Pay123!' });
  const token = signToken(user);
  const p = await createProduct({ quantity: 1, price: 50 });

  // crea orden
  const oRes = await request
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ product_id: p.product_id, quantity: 1 }] });

  const orderId = oRes.body.order_id;

  // pago succeed con Idempotency-Key
  const payRes = await request
    .post('/api/payments')
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', Date.now().toString())
    .send({ order_id: orderId, currency: 'USD', mock: 'succeed' });

  expect(payRes.status).toBe(201);
  expect(payRes.body.status).toBe('succeeded');

  const order = await Order.findByPk(orderId);
  expect(order.status).toBe('paid');
});
