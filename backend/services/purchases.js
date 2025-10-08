// backend/services/purchases.js
const { Op } = require('sequelize');
const { OrderDetail, Order } = require('../models');

const QUALIFYING_STATUSES = ['paid', 'shipped']; // ajusta si agregas 'delivered'

exports.userPurchasedProduct = async (userId, productId, transaction = null) => {
  const count = await OrderDetail.count({
    include: [
      {
        model: Order,
        required: true,
        where: {
          user_id: userId,
          status: { [Op.in]: QUALIFYING_STATUSES },
        },
        attributes: [],
      },
    ],
    where: { product_id: productId },
    transaction,
  });
  return count > 0;
};
