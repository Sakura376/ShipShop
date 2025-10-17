const { request, resetDb, createUser, signToken, createProduct, Order } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('misma Idempotency-Key devuelve mismo intent; webhook mueve orden', async () => {
  const user = await createUser({ email: 'idemp@ship.shop', password: 'x' });
  const token = signToken(user);
  const p = await createProduct({ quantity: 1, price: 25 });

  // orden
  const oRes = await request
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ product_id: p.product_id, quantity: 1 }] });
  const orderId = oRes.body.order_id;

  const idem = 'key-' + Date.now();

  // processing (no cambia orden)
  const r1 = await request
    .post('/api/payments')
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', idem)
    .send({ order_id: orderId, currency: 'USD', mock: 'process' });
  expect(r1.status).toBe(201);
  expect(r1.body.status).toBe('processing');
  const providerRef = r1.body.provider_ref;

  // repetir con la misma key → mismo intent
  const r2 = await request
    .post('/api/payments')
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', idem)
    .send({ order_id: orderId, currency: 'USD', mock: 'process' });

  expect(r2.status).toBe(200); // tu controlador devuelve 200 al reutilizar
  expect(r2.body.id).toBe(r1.body.id);

  // webhook succeed
  const hook = await request
    .post('/api/payments/webhook')
    .set('X-Payment-Signature', process.env.PAYMENT_WEBHOOK_SECRET || 'devsecret')
    .send({ provider_ref: providerRef, status: 'succeeded' });
  expect(hook.status).toBe(200);

  const order = await Order.findByPk(orderId);
  expect(order.status).toBe('paid');
});
