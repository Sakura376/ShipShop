const { request, resetDb, createUser, signToken, createProduct, Order } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('no admin recibe 403; admin puede cambiar estado', async () => {
  const buyer = await createUser({ email: 'buyer@ship.shop', username: 'buyer1', password: 'x' });
  const buyerToken = signToken(buyer);

  const admin = await createUser({ email: 'cap@ship.shop', username: 'admin1', password: 'x' }); // ADMIN_EMAILS
  const adminToken = signToken(admin);

  // ⬇️ fuerza activo y stock suficiente
  const p = await createProduct({ quantity: 5, price: 10, is_active: 1 }); 

  // crea orden del buyer
  const oRes = await request
    .post('/api/orders')
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({ items: [{ product_id: p.product_id, quantity: 1 }] });

  expect([200, 201]).toContain(oRes.status);
  const orderId = oRes.body.order_id ?? oRes.body.id;
  expect(orderId).toBeTruthy(); // asegura que sí se creó

  // buyer (no admin) no puede cambiar estado
  const fbd = await request
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({ status: 'paid' });
  expect([401, 403]).toContain(fbd.status);

  // admin sí puede
  const ok = await request
    .patch(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ status: 'paid' });
  expect(ok.status).toBe(200);

  const order = await Order.findByPk(orderId);
  expect(order.status).toBe('paid');
});
