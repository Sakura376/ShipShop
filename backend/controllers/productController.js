const { Op } = require('sequelize');
const { Product } = require('../models');

// GET /api/products
exports.list = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, active, page = 1, pageSize = 20, sort = 'created_at', dir = 'DESC' } = req.query;

    const where = {};
    if (q) where.title = { [Op.like]: `%${q}%` };
    if (minPrice != null || maxPrice != null) {
      where.price = {};
      if (minPrice != null) where.price[Op.gte] = Number(minPrice);
      if (maxPrice != null) where.price[Op.lte] = Number(maxPrice);
    }
    if (active != null) where.is_active = Number(active) === 1;

    const offset = (Number(page) - 1) * Number(pageSize);
    const order = [[sort, dir]];
    const { rows, count } = await Product.findAndCountAll({
      where, order, limit: Number(pageSize), offset
    });

    res.json({
      items: rows,
      meta: {
        page: Number(page),
        pageSize: Number(pageSize),
        total: count,
        totalPages: Math.ceil(count / Number(pageSize)) || 1,
        sort, dir
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error listando productos' });
  }
};

// GET /api/products/:id
exports.getById = async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: 'No encontrado' });
    res.json(prod);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error consultando producto' });
  }
};

// POST /api/products  (admin)
exports.create = async (req, res) => {
  try {
    const prod = await Product.create(req.body);
    res.status(201).json(prod);
  } catch (e) {
    console.error(e);
    // Conflicto por SKU duplicado
    if (String(e?.original?.code).includes('ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'SKU ya existe' });
    }
    res.status(500).json({ error: 'Error creando producto' });
  }
};

// PATCH /api/products/:id  (admin)
exports.update = async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: 'No encontrado' });
    await prod.update(req.body);
    res.json(prod);
  } catch (e) {
    console.error(e);
    if (String(e?.original?.code).includes('ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'SKU ya existe' });
    }
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};

// DELETE /api/products/:id  (admin)
exports.remove = async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: 'No encontrado' });
    await prod.destroy();
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error eliminando producto' });
  }
};
