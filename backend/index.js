const express = require("express");
const dbConnection = require("./db/db");
require("dotenv").config();

const User = require("./routes/user");
const Role = require("./routes/role");

const app = express();
app.use(express.json());
app.use("/api/user/", User);
app.use("/api/role/", Role);


app.listen(process.env.PORT, () => {
  console.log("Backend running on port " + process.env.PORT);
});

dbConnection();
