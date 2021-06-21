const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
}).required();

const update = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
}).required();

module.exports = { create, update };
