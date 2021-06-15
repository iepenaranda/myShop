const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.ObjectId, ref: "categories" },
  price: Number,
  stock: Number,
  provider: { type: mongoose.Schema.ObjectId, ref: "users" },
  active: Boolean,
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;
