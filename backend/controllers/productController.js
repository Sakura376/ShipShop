const { Op } = require('sequelize');
const { Product } = require('../models');
const product = require('../models/product');

exports.list = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, active, page = 1, pageSize = 12, sort = 'created_at', dir = 'DESC' } = req.query;

    const where = {};
    if (q) where.title = { [Op.like]: `%${q}%` };
    if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };
    if (active !== undefined) where.is_active = Number(active); // ← columna real en DB

    const limit = Math.max(1, Number(pageSize));
    const offset = (Math.max(1, Number(page)) - 1) * limit;

    const { rows, count } = await Product.findAndCountAll({
      where,
      order: [[sort, dir]],
      limit,
      offset
    });

    res.json({
      items: rows.map(p => ({
        id: p.product_id,
        sku: p.sku,
        title: p.title,
        description: p.description,
        descriptionInfo: p.descriptionInfo,
        imageUrl: p.imageUrl,
        imageInfo: p.imageInfo,
        tipoNave: p.tipoNave,
        caracteristics: p.caracteristics,
        price: Number(p.price),
        quantity: p.quantity,
        active: p.active
      })),
      meta: {
        page: Number(page),
        pageSize: limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        sort, dir
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
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

exports.searchByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.json([]); // nada que buscar
    }

    const products = await Product.findAll({
      where: {
        title: {
          [Op.like]: `%${name}%`
        }
      },
      limit: 10
    });

    return res.json(products);
  } catch (error) {
    console.error("Error buscando productos:", error);
    return res.status(500).json({ error: "Error buscando productos" });
  }
};



