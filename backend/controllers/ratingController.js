const { Sequelize, ProductRating } = require('../models');
const { userPurchasedProduct } = require('../services/purchases');

// POST /api/products/:id/ratings  (auth)  -> crea/actualiza mi rating
exports.upsertMyRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.id);
    const { rating, comment } = req.body;

    // 1) Verificar compra previa del producto
    const purchased = await userPurchasedProduct(userId, productId);
    if (!purchased) {
      return res.status(403).json({ error: 'Solo puedes calificar productos que has comprado' });
    }

    // 2) Upsert de rating (un rating por user-product)
    const [row, created] = await ProductRating.findOrCreate({
      where: { user_id: userId, product_id: productId },
      defaults: { user_id: userId, product_id: productId, rating, comment: comment ?? null },
    });

    if (!created) {
      await row.update({ rating, comment: comment ?? null, updated_at: new Date() });
    }

    // 3) Promedio actualizado
    const agg = await ProductRating.findOne({
      attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']],
      where: { product_id: productId },
      raw: true,
    });

    return res.status(created ? 201 : 200).json({
      rating: {
        rating_id: row.rating_id,
        product_id: row.product_id,
        user_id: row.user_id,
        rating: row.rating,
        comment: row.comment,
      },
      avg: Number(agg.avg || 0).toFixed(2),
      created,
    });
  } catch (e) {
    console.error(e);
    // ER_DUP_ENTRY por unique (user_id, product_id) – poco probable por findOrCreate, pero por si acaso
    if (String(e?.original?.code).includes('ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'Ya calificaste este producto' });
    }
    return res.status(500).json({ error: 'Error guardando rating' });
  }
};

// GET /api/products/:id/ratings  -> lista (paginada) + promedio
exports.listForProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);

    const offset = (page - 1) * pageSize;

    const [rows, count, agg] = await Promise.all([
      ProductRating.findAll({
        where: { product_id: productId },
        order: [['rating_date', 'DESC']],
        limit: pageSize,
        offset,
      }),
      ProductRating.count({ where: { product_id: productId } }),
      ProductRating.findOne({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']],
        where: { product_id: productId },
        raw: true,
      }),
    ]);

    res.json({
      items: rows,
      meta: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize) || 1,
        avg: Number(agg?.avg || 0).toFixed(2),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error listando ratings' });
  }
};
