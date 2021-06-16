const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: mongoose.Schema.ObjectId, ref: "roles" },
  active: { type: Boolean, default: true},
  date: { type: Date, default: Date.now },
  profile: String,
});

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      iat: moment().unix(),
    },
    process.env.MY_SECRET_KEY
  );
};

const User = mongoose.model("users", userSchema);
module.exports = User;
