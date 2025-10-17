const { sequelize, Order, PaymentIntent } = require('../models');
const crypto = require('node:crypto');

function safeEq(a,b){ // comparación de firma
  const A = Buffer.from(String(a || ''));
  const B = Buffer.from(String(b || ''));
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}

// POST /api/payments  (auth user)
// Headers: Idempotency-Key: <uuid/random>
exports.createPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const idem = req.get('Idempotency-Key');
    if (!idem) return res.status(400).json({ error: 'Idempotency-Key requerido' });

    const { order_id, currency='USD', mock='succeed' } = req.body;

    // Si ya existe con esta key, devolvemos el mismo intent (idempotente)
    const existing = await PaymentIntent.findOne({ where: { idempotency_key: idem } });
    if (existing) {
      await t.rollback();
      return res.json(existing);
    }

    const order = await Order.findOne({ where: { order_id, user_id: userId }, transaction: t, lock: t.LOCK.UPDATE });
    if (!order) { await t.rollback(); return res.status(404).json({ error: 'Orden no encontrada' }); }
    if (!['created','cancelled','refunded'].includes(order.status) && mock !== 'succeed') {
      // si ya está paid/shipped, solo devolvemos 409
      await t.rollback();
      return res.status(409).json({ error: `Orden en estado ${order.status}` });
    }

    // Crear intent
    const intent = await PaymentIntent.create({
      order_id, amount: order.total, currency, status: 'processing', idempotency_key: idem,
      provider_ref: 'mock_' + crypto.randomBytes(6).toString('hex')
    }, { transaction: t });

    // Simulación de resultado inmediato (en real sería webhook)
    if (mock === 'fail') {
      await intent.update({ status: 'failed', error_message: 'Mocked failure' }, { transaction: t });
    } else if (mock === 'process') {
      // se queda en 'processing'; un webhook posterior lo moverá
    } else {
      // succeed
      if (order.status === 'created') {
        await order.update({ status: 'paid' }, { transaction: t });
      }
      await intent.update({ status: 'succeeded' }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(intent);
  } catch (e) {
    await t.rollback();
    console.error(e);
    if (String(e?.original?.code).includes('ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'Idempotency-Key duplicado' });
    }
    res.status(500).json({ error: 'Error creando pago' });
  }
};

// POST /api/payments/webhook (sin auth usuario; usa firma secreta)
// Headers: X-Payment-Signature: <secret>
// Body: { provider_ref, status: 'succeeded'|'failed'|'cancelled' }
exports.webhook = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const sig = req.get('X-Payment-Signature');
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || 'devsecret';
    if (!safeEq(sig, secret)) { await t.rollback(); return res.status(401).json({ error: 'Firma inválida' }); }

    const { provider_ref, status } = req.body;
    if (!provider_ref || !['succeeded','failed','cancelled'].includes(status)) {
      await t.rollback(); return res.status(400).json({ error: 'Payload inválido' });
    }

    const intent = await PaymentIntent.findOne({ where: { provider_ref }, transaction: t, lock: t.LOCK.UPDATE, include: [{ model: Order }] });
    if (!intent) { await t.rollback(); return res.status(404).json({ error: 'Intent no encontrado' }); }

    // Idempotencia del webhook: si ya está en ese estado, ok
    if (intent.status === status) { await t.commit(); return res.json({ ok: true }); }

    // Actualiza intent
    await intent.update({ status }, { transaction: t });

    // Transición de orden
    if (status === 'succeeded' && intent.order && intent.order.status === 'created') {
      await intent.order.update({ status: 'paid' }, { transaction: t });
    }
    if (status === 'cancelled' && intent.order && intent.order.status === 'created') {
      await intent.order.update({ status: 'cancelled' }, { transaction: t });
    }

    await t.commit();
    res.json({ ok: true });
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).json({ error: 'Error en webhook' });
  }
};
