const Joi = require("joi");

const create = Joi.object({
  product: Joi.array().items(Joi.string()).required(),
  amount: Joi.array().items(Joi.number()).required(),
}).required();

const update = Joi.object({
  product: Joi.array().items(Joi.string()).required(),
  amount: Joi.array().items(Joi.number()).required(),
  price: Joi.array().items(Joi.number()).required(),
  totalPrice: Joi.number().required,
  buyer: Joi.string().required(),
}).required();

module.exports = { create, update };
