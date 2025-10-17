const { request, resetDb, createUser, signToken, createProduct, Order } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('crea orden y calcula total', async () => {
  const user = await createUser({ email: 'buyer@ship.shop', password: 'Compr4!' });
  const token = signToken(user);
  const p = await createProduct({ quantity: 3, price: 100 });

  const res = await request
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ product_id: p.product_id, quantity: 2 }] });

  expect(res.status).toBe(201); // o 200 según tu controlador
  expect(res.body.order_id).toBeTruthy();

  const order = await Order.findByPk(res.body.order_id);
  expect(order.total).toBe(200);
});
