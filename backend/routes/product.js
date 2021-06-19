const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const Auth = require("../middleware/auth");
const checkRole = require("../middleware/role");
const Schema = require("../schema/product");
const checkData = require("../middleware/checkData");

router.post(
  "/create",
  checkData(Schema.create),
  Auth,
  checkRole("ADMIN", "Employee", "Provider"),
  async (req, res) => {
    let validId = mongoose.Types.ObjectId.isValid(req.body.category);
    if (!validId) return res.status(400).send("Error: Invalid category id.");
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Error: Invalid category id.");

    validId = mongoose.Types.ObjectId.isValid(req.body.provider);
    if (!validId) return res.status(400).send("Error: Invalid provider id.");
    if (!provider) return res.status(400).send("Error: Invalid provider id.");

    let product = await Product.findOne({ name: req.body.name });
    if (product)
      return res.status(400).send("Error: The product already exist.");

    product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      provider: req.body.provider,
    });

    const result = product.save();
    if (!result)
      return res.status(401).send("Error: Could not save the product.");
    return res.status(200).send({
      message: "The product was registered successfully.",
      data: product,
    });
  }
);

router.get("/list/:name?", async (res, req) => {
  const product = await Product.find({ name: new RegExp(req.params.name, "i") })
    .populate([
      { path: "category", select: "name" },
      { path: "provider", select: "name" },
    ])
    .exec();

  if (!product)
    return res.status(401).send("Error: No products match with the search.");

  return res.status(200).send({ message: "Search complete.", data: product });
});

router.put(
  "/update",
  checkData(Schema.update),
  Auth,
  checkRole("ADMIN", "Employee"),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Error: Invalid product id.");

    const product = await Product.findByIdAndUpdate(
      req.body._id,
      {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        provider: req.body.provider,
        active: true,
      },
      {
        new: true,
      }
    );
    if (!product)
      return res.status(400).send("Error: Could not update the Product.");
    return res
      .status(200)
      .send({ message: "Product was updated successfully", data: product });
  }
);

router.put(
  "/delete",
  checkData(Schema.update),
  Auth,
  checkRole("ADMIN", "Employee"),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Error: Invalid product id.");

    const product = await Product.findByIdAndUpdate(
      req.body._id,
      {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        provider: req.body.provider,
        active: false,
      },
      {
        new: true,
      }
    );
    if (!product)
      return res.status(400).send("Error: Could not delete the Product.");
    return res
      .status(200)
      .send("Product was deleted successfully");
  }
);

module.exports = router;
