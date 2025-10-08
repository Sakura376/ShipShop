const { sequelize } = require('../models');
const { Order, OrderDetail, Product } = require('../models');

exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ error: 'Items requeridos' });

    // Validar y calcular totales + controlar stock
    let total = 0;
    for (const it of items) {
      const prod = await Product.findByPk(it.product_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!prod || !prod.is_active) throw new Error('Producto no disponible');
      if (it.quantity < 1) throw new Error('Cantidad inválida');
      if (prod.quantity < it.quantity) throw new Error('Stock insuficiente');

      total += Number(prod.price) * it.quantity;
      await prod.update({ quantity: prod.quantity - it.quantity }, { transaction: t });
    }

    const order = await Order.create({ user_id: userId, total, status: 'created' }, { transaction: t });

    const rows = items.map(x => ({
      order_id: order.order_id,
      product_id: x.product_id,
      quantity: x.quantity,
      unit_price: x.unit_price ?? undefined // opcional; si no viene, usa precio actual
    }));

    // Completar unit_price con precio actual si no vino en request
    for (const r of rows) {
      if (r.unit_price == null) {
        const p = await Product.findByPk(r.product_id, { transaction: t });
        r.unit_price = Number(p.price);
      }
    }

    await OrderDetail.bulkCreate(rows, { transaction: t });

    await t.commit();
    res.status(201).json({ order_id: order.order_id, total, status: order.status });
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(400).json({ error: e.message || 'No se pudo crear la orden' });
  }
};

exports.listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [['order_date','DESC']],
      attributes: ['order_id','total','status','order_date']
    });
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error listando órdenes' });
  }
};

exports.getMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({
      where: { order_id: req.params.id, user_id: userId },
      include: [{ model: OrderDetail, include: [{ model: Product, attributes:['title','sku'] }] }]
    });
    if (!order) return res.status(404).json({ error: 'No encontrada' });
    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error obteniendo orden' });
  }
};
