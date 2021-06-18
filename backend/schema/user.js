const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  profile: Joi.string(),
}).required();

const update = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  profile: Joi.string(),
}).required();

module.exports = { create, update };
