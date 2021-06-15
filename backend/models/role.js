const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: String,
  description: String,
  active: { type: Boolean, default: true },
});

const Role = mongoose.model("roles", roleSchema);
module.exports = Role;
