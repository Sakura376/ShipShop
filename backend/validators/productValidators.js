const { celebrate, Joi, Segments } = require('celebrate');

const idParam = Joi.number().integer().min(1).required();

const sku = Joi.string().max(40).required();
const title = Joi.string().max(120).required();
const tipo_nave = Joi.string().max(60).allow('', null);
const description = Joi.string().allow('', null);
const description_info = Joi.string().allow('', null);
const caracteristics = Joi.string().allow('', null);
const image_product = Joi.string().uri().max(512).allow('', null);
const image_info = Joi.string().uri().max(512).allow('', null);
const price = Joi.number().precision(2).min(0).required();
const quantity = Joi.number().integer().min(0).required();
const is_active = Joi.boolean();

exports.validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object({
    sku, title, tipo_nave, description, description_info, caracteristics,
    image_product, image_info, price, quantity, is_active
  })
});

exports.validateUpdateProduct = celebrate({
  [Segments.PARAMS]: Joi.object({ id: idParam }),
  [Segments.BODY]: Joi.object({
    sku: sku.optional(),
    title: title.optional(),
    tipo_nave: tipo_nave.optional(),
    description: description.optional(),
    description_info: description_info.optional(),
    caracteristics: caracteristics.optional(),
    image_product: image_product.optional(),
    image_info: image_info.optional(),
    price: price.optional(),
    quantity: quantity.optional(),
    is_active: is_active.optional(),
  }).min(1) // al menos un campo
});

exports.validateGetOrDelete = celebrate({
  [Segments.PARAMS]: Joi.object({ id: idParam })
});

exports.validateList = celebrate({
  [Segments.QUERY]: Joi.object({
    q: Joi.string().max(120),
    minPrice: Joi.number().precision(2).min(0),
    maxPrice: Joi.number().precision(2).min(0),
    active: Joi.number().valid(0,1),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(200).default(20),
    sort: Joi.string().valid('created_at','price','title').default('created_at'),
    dir: Joi.string().valid('ASC','DESC').default('DESC')
  })
});
