const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let jwtToken = req.header("Authorization");
  if (!jwtToken)
    return res
      .status(400)
      .send("Error: token does not exist, authorization denied.");

  jwtToken = jwtToken.split(" ")[1];
  if (!jwtToken)
    return res
      .status(401)
      .send("Error: token does not exist, authorization denied.");
  try {
    const payload = await jwt.verify(jwtToken, process.env.MY_SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).send("Error: invalid token, authorization denied.");
  }
};

module.exports = auth;