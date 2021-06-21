const express = require("express");
const router = express.Router();
const Sale = require("../models/sale");
const Product = require("../models/product");
const mongoose = requrie("mongoose");
const Auth = require("../middleware/auth");
const checkRole = require("../middleware/role");
const checkData = require("../middleware/checkData");
const Schema = require("../schema/sale");

router.post(
  "/create",
  Auth,
  checkRole("client"),
  checkData(Schema.create),
  async (req, res) => {
    let prices = [];
    try {
      for (let i = 0; i < req.body.product.length; i++) {
        const prodId = req.body.product[i];
        const amount = req.body.amount[i];
        const product = await Product.findById(prodId);

        if (!product) throw "Error: Invalid product id";
        if (product.stock - amount < 0) throw "Error: Not enough stock.";
        const stock = product.stock - amount;
        prices.push(product.price * amount);

        const result = await Product.findByIdAndUpdate(prodId, {
          name: product.name,
          category: product.category,
          price: product.price,
          stock: stock,
          provider: product.provider,
          active: true,
        });
        if (!result) throw "Error: could not update stock.";
      }
    } catch (error) {
      return res.status(401).send(err);
    }

    const totalPrice = prices.reduce((a, b) => a + b, 0);
    const sale = new Sale({
      product: req.body.product,
      amount: req.body.amount,
      prices: prices,
      totalPrice: totalPrice,
      buyer: req.user._id,
    });

    if (!sale) return res.status(401).send("Error: Could not complete buy.");
    return res.status(200).send("Sale complete.");
  }
);

module.exports = router;