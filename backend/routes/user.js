const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");
const Role = require("../models/role");


router.post("/register", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send("Error: Incomplete data.");

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
    const jwtToken = user.generateJWT();
    res.status(200).send({ jwtToken });
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

router.put("/update", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.role ||
    !req.body._id
  )
    return res.status(400).send("Error: Incomplete data");

  const validId = mongoose.Types.ObjectId.isValid(req.body.role);
  if(!validId) return res.status(400).send("Error: Invalid role id.")
  const role = await Role.findById(req.body.role);
  if (!role) return res.status(400).send("Error: Invalid Role id");

  const hash = await bcrypt.hash(req.body.password, 9);
  const user = await User.findByIdAndUpdate(
    req.body._id,
    {
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: req.body.role,
      active: true,
      profile: String,
    },
    { new: true }
  );

  if (!user) return res.status(401).send("Error: Could not update user.");
  return res
    .status(200)
    .send({ message: "User updated successfully.", data: user });
});

router.put("/delete", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body._id)
    return res.status(400).send("Error: Incomplete data");

  const role = await Role.findOne({ name: "client" });
  if (!role) return res.status(400).send("Error: Invalid Role id");

  const hash = await bcrypt.hash(req.body.password, 9);
  const user = await User.findByIdAndUpdate(
    req.body._id,
    {
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: role._id,
      active: false,
      profile: String,
    },
    { new: true }
  );

  if (!user) return res.status(401).send("Error: Could not update user.");
  return res
    .status(200)
    .send({ message: "User updated successfully.", data: user });
});

module.exports = router;