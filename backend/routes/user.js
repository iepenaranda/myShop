const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");
const Role = require("../models/role");
const Auth = require("../middleware/auth");
const Schema = require("../schema/user");
const checkData = require("../middleware/checkData");
const checkRole = require("../middleware/role");

router.post("/register", checkData(Schema.create), async (req, res) => {
  const email = await User.findOne({ email: req.body.email });
  if (email)
    return res.status(400).send("Error: The email is already registered.");

  const validId = mongoose.Types.ObjectId.isValid(req.body.role);
  if(!validId) return res.status(400).send("Error: Invalid role id.")
  const role = await Role.findById(req.body.role);
  if (!role) return res.status(400).send("Error: The role does not exist.");

  const hash = await bcrypt.hash(req.body.password, 9);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    role: req.body.role,
    profile: req.body.profile,
  });

  try {
    const result = await user.save();
    if (!result)
      return res.status(401).send("Error: User could not be registered.");
    res.status(200).send("User registered successfully.");
  } catch (error) {
    return res.status(401).send("Error: User could not be registered.");
  }
});

router.get("/list/:name?", async (req, res) => {
  const users = await User.find({ name: new RegExp(req.params["name"], "i") })
    .populate({path: "role", select: "name"})
    .exec();

  if (!users)
    return res
      .status(401)
      .send("There are no users that match with the search.");
  return res.status(200).send({ users });
});

router.put("/update", checkData(Schema.update), Auth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.body.role);
  if(!validId) return res.status(400).send("Error: Invalid role id.")
  const role = await Role.findById(req.body.role);
  if (!role) return res.status(400).send("Error: Invalid role id");

  const hash = await bcrypt.hash(req.body.password, 9);
  const user = await User.findByIdAndUpdate(
    req.body._id,
    {
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: req.body.role,
      active: true,
      profile: req.body.profile,
    },
    { new: true }
  );

  if (!user) return res.status(401).send("Error: Could not update user.");
  return res
    .status(200)
    .send({ message: "User updated successfully.", data: user });
});

router.put("/delete", checkData(Schema.update), Auth, async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 9);
  const user = await User.findByIdAndUpdate(
    req.body._id,
    {
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: req.body.role,
      active: false,
      profile: req.body.profile,
    },
    { new: true }
  );

  if (!user) return res.status(401).send("Error: Could not update user.");
  return res
    .status(200)
    .send({ message: "User updated successfully.", data: user });
});

module.exports = router;