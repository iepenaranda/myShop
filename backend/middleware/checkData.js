const Joi = require("joi");

const checkData = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send("Error: Incomplete data");
    next();
  };
};

module.exports = checkData;
