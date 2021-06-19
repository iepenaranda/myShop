const express = require("express");
const router = express.Router();
const Role = require("../models/role");
const mongoose = require("mongoose");
const Schema = require("../schema/role");
const checkData = require("../middleware/checkData");
const checkRole = require("../middleware/role");

router.post("/create", checkData(Schema.create), async (req, res) => {
  let role = await Role.findOne({ name: req.body.name });
  if (role) return res.status(401).send("Error: The role already exist.");

  role = new Role({
    name: req.body.name,
    description: req.body.description,
  });

  const result = await role.save();
  if (!result) return res.status(401).send("Error: Could not register role.");
  return res.status(200).send("Role was registered successfully.");
});

router.get("/list/:name?", Auth, checkRole("ADMIN"), async (req, res) => {
  let role = await Role.find({ name: new RegExp(req.params.name, "i") }).exec();

  if (!role) return res.status(400).send("Error: The role does not exist.");
  return res.status(200).send({ role });
});

router.put(
  "/update",
  checkData(Schema.update),
  Auth,
  checkRole("ADMIN"),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Error: invalid id");

    const role = await Role.findByIdAndUpdate(
      req.body._id,
      {
        name: req.body.name,
        description: req.body.description,
        active: req.body.active,
      },
      { new: true }
    );

    if (!role) return res.status(401).send("Error: The role was not updated.");
    return res
      .status(200)
      .send({ message: "The role was updated successfully.", data: role });
  }
);

router.put(
  "/delete",
  checkData(Schema.update),
  Auth,
  checkRole("ADMIN"),
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Error: invalid id");

    let role = await Role.findById(req.body._id);
    if (!role.active)
      return res.status(400).send("Error: The role does not exist.");

    role = await Role.findByIdAndUpdate(
      req.body._id,
      {
        name: req.body.name,
        description: req.body.description,
        active: false,
      },
      { new: true }
    );

    if (!role) return res.status(401).send("Error: The role was not deleted.");
    return res.status(200).send("The role was deleted successfully.");
  }
);

module.exports = router;
