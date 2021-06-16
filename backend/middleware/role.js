const Role = require("../models/role");

const checkRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const roleUser = await Role.findById(req.user.role);

      if (!roles.includes(roleUser.name))
        return res
          .status(400)
          .send("Error: you do not have permisson to do this action.");

      next();
    } catch (error) {
      res.status(400).send("Error: Could not verify role.");
    }
  };
};

module.exports = checkRole;
