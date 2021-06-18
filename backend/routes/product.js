const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const Auth = require("../middleware/auth");
const checkRole = require("../middleware/role");

router.post(
  "/create",
  Auth,
  checkRole("ADMIN", "Employee", "Provider"),
  async (req, res) => {
    if (
      !req.body.name ||
      !req.body.category ||
      !req.body.price ||
      !req.body.stock ||
      !req.body.provider
    )
      return res.status(400).send("Error: Incomplete data.");

    let validId = mongoose.Types.ObjectId.isValid(req.body.category);
    if (!validId) return res.status(400).send("Error: Invalid category id.");
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).send("Error: The category does not exist.");

    validId = mongoose.Types.ObjectId.isValid(req.body.provider);
    if (!validId) return res.status(400).send("Error: Invalid provider id.");
    if (!provider)
      return res.status(400).send("Error: The provider does not exist.");

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
    return res
      .status(200)
      .send({
        message: "The product was registered successfully",
        data: product,
      });
  }
);

router.get("/list/:name?", async (res,req) => {
  const product = await Product.find({name: new RegExp(req.params.name, "i")})
  .populate([
    {path: "category", select: "name"},
    {path: "provider", select: "name"}
  ])
  .exec();

  if(!product) return res.status(401).send("Error: No products match with the search.");

  return res.status(200).send({message: "Search complete.", data: product});
});

router.put("/update", Auth, checkRole("ADMIN", "Employee"), async(req, res) => {
  if(!req.body.name || !req.body.category || !req.body.price || !req.body.stock || !req.body.provider)
  return res.status(401).send("Error: data incomplete");
});

router.put("/delete", Auth, checkRole("ADMIN", "Employee"), async (req, res) =>{

});

module.exports = router;