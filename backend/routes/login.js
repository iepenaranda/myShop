const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/login", async (req, res) => {
  if(!req.body.email || !req.body.password)
  return res.status(400).send("Error: Data incomplete");
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.active) return res.status(400).send("Error: Incorrect user or password.");

  const hash = await bcrypt.compare(req.body.password, user.password);
  if (!hash) return res.status(400).send("Error: Incorrect user or password.");

  try {
    const jwtToken = user.generateJWT();
    return res.status(200).send({ jwtToken });
  } catch (err) {
    return res.status(401).send("Error: Could not login.");
  }
});

module.exports = router;
