const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/category");
const Auth = require("../middleware/auth");
const checkRole = require("../middleware/role");
const checkData = require("../middleware/checkData");
const Schema = require("../schema/category");

router.post(
  "/create",
  checkData(Schema.create),
  Auth,
  checkRole("ADMIN", "Employee"),
  async (req, res) => {
    let category = await Category.findOne({ name: req.body.name });
    if (category)
      return res.status(400).send("Error: the category already exist.");

    category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    const result = await category.save();
    if (!result)
      return res.status(401).send("Error: Could not register cateogry.");

    return res
      .status(200)
      .send({ message: "Category registered successfully.", data: category });
  }
);

router.get("/list/:name?", Auth, async (req, res) => {
  const category = await Category.find({
    name: new RegExp(req.params.name, "i"),
  }).exec();

  if (!category)
    return res
      .status(401)
      .send("Could not find categories that match with the search.");

  return res.status(200).send({ category });
});

router.put(
  "/update",
  checkData(Schema.update),
  Auth,
  checkRole("ADMIN", "Employee"),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Error: Invalid id");

    const category = await Category.findByIdAndUpdate(
      req.body._id,
      {
        name: req.body.name,
        description: req.body.description,
        active: true,
      },
      { new: true }
    );

    if (!category)
      return res.status(401).send("Error: Could not update the cateogry.");

    return res
      .status(200)
      .send({ message: "Category updated successfully", data: category });
  }
);

router.put(
  "/delete",
  checkData(Schema.update),
  Auth,
  checkRole("ADMIN", "Employee"),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Error: Invalid id");

    const category = await Category.findByIdAndUpdate(req.body._id, {
      name: req.body.name,
      description: req.body.description,
      active: false,
    });

    if (!category)
      return res.status(401).send("Error: Could not delete the cateogry.");
    return res.status(200).send("Category deleted successfully");
  }
);

module.exports = router;
