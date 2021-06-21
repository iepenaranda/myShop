const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.ObjectId, ref: "products" }],
  amount: [{type: Number}],
  prices: [{type: Number}],
  totalPrice: Number,
  buyer: { type: mongoose.Schema.ObjectId, ref: "users" },
  active: {type: Boolean, default: true},
});

const sale = mongoose.model("sales", saleSchema);
module.exports = sale;
