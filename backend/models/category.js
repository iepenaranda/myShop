const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  active: {type: Boolean, default: true},
});

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;
