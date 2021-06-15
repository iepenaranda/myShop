const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  active: Boolean,
});

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;
