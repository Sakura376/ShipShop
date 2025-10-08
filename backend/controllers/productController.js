const { Product, Sequelize } = require('../models');
const { Op } = Sequelize; // 

// GET /api/products?q=texto&minPrice=1000&maxPrice=2000&active=1
exports.list = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, active } = req.query;

    const where = {};

    // Filtro por estado activo/inactivo
    if (active !== undefined) {
      where.is_active = active === '1' || active === 'true';
    }

    // Filtro por rango de precio
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    // Búsqueda por título o tipo de nave
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { tipo_nave: { [Op.like]: `%${q}%` } }
      ];
    }

    const items = await Product.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 100
    });

    res.json(items);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// GET /api/products/:id
exports.getById = async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};
