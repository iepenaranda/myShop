const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  provider: Joi.string().required(),
});

const update = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  provider: Joi.string().required(),
});

module.exports = { create, update };
