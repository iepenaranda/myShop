const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.ObjectId, ref: "products" }],
  totalprice: Number,
  seller: { type: mongoose.Schema.ObjectId, ref: "users" },
  buyer: { type: mongoose.Schema.ObjectId, ref: "users" },
});

const sale = mongoose.model("sales", saleSchema);
module.exports = sale;
