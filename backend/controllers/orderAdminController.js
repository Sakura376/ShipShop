const { Order } = require('../models');

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'created','paid','shipped','cancelled','refunded'
    const valid = ['created','paid','shipped','cancelled','refunded'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Estado inválido' });

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    await order.update({ status });
    res.json({ order_id: order.order_id, status: order.status });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
};
