// controllers/orderController.js
const { sequelize, Order, OrderDetail, Product } = require('../models');

exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ error: 'Items requeridos' });

    let total = 0;

    // Validar cada item y afectar stock
    for (const it of items) {
      const qty = Number(it.quantity);
      if (!Number.isInteger(qty) || qty < 1) throw new Error('Cantidad inválida');

      const prod = await Product.findByPk(it.product_id, { transaction: t /*, lock: t.LOCK.UPDATE */ });

      // activo en MySQL(1/0) y SQLite(true/false)
      const active = prod && (prod.active === true || prod.active === 1);
      if (!prod || !active) throw new Error('Producto no disponible');


      if (Number(prod.quantity) < qty) throw new Error('Stock insuficiente');

      total += Number(prod.price) * qty;

      // descuenta stock
      await prod.update(
        { quantity: Number(prod.quantity) - qty },
        { transaction: t }
      );
    }

    // Crea la orden
    const order = await Order.create(
      { user_id: userId, total, status: 'created' },
      { transaction: t }
    );

    // Crea los detalles (usando precio actual si no viene)
    for (const it of items) {
      const prod = await Product.findByPk(it.product_id, { transaction: t });
      const unitPrice = Number(it.unit_price ?? prod.price);

      await OrderDetail.create(
        {
          order_id: order.order_id,
          product_id: it.product_id,
          quantity: Number(it.quantity),
          unit_price: unitPrice,
        },
        { transaction: t }
      );
    }

    await t.commit();
    return res.status(201).json({ order_id: order.order_id, total, status: order.status });
  } catch (e) {
    await t.rollback();
    console.error(e);
    return res.status(400).json({ error: e.message || 'No se pudo crear la orden' });
  }
};

exports.listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [['order_date', 'DESC']],
      attributes: ['order_id', 'total', 'status', 'order_date'],
    });
    // (opcional) estandariza shape:
    // return res.json({ items: orders });
    return res.json(orders);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error listando órdenes' });
  }
};

exports.getMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({
      where: { order_id: req.params.id, user_id: userId },
      include: [{ model: OrderDetail, include: [{ model: Product, attributes: ['title', 'sku'] }] }],
    });
    if (!order) return res.status(404).json({ error: 'No encontrada' });
    return res.json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error obteniendo orden' });
  }
};
