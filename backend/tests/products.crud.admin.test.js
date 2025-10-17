const { request, resetDb, createUser, signToken } = require('./helpers');
const { Product } = require('../models');

beforeAll(async () => { await resetDb(); });

it('admin puede crear/editar/eliminar producto', async () => {
  const admin = await createUser({ email: 'cap@ship.shop', password: 'Admin123!' }); // coincide con ADMIN_EMAILS
  const token = signToken(admin);

  // Crear
  const createRes = await request
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ sku: 'ADM-001', title: 'Admin Rocket', price: 999, quantity: 5, is_active: true });
  expect(createRes.status).toBe(201);
  const id = createRes.body.product_id || createRes.body.id;

  // Patch
  const patchRes = await request
    .patch(`/api/products/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ price: 888, quantity: 7 });
  expect(patchRes.status).toBe(200);

  // Delete
  const delRes = await request
    .delete(`/api/products/${id}`)
    .set('Authorization', `Bearer ${token}`);
  expect([200,204]).toContain(delRes.status);

  const p = await Product.findByPk(id);
  // según implementación puede ser hard delete o soft/is_active=false
  // solo validamos que no esté activo
  if (p) expect(p.is_active).toBe(0);
});
