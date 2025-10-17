const { request, resetDb } = require('./helpers');

beforeAll(async () => { await resetDb(); });

it('GET /api/health OK', async () => {
  const res = await request.get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
});
