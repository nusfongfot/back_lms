const jwt = require("jsonwebtoken");

exports.genToken = (payload) => {
  const privateKey = process.env.JSONWEB_SECRET;
  const options = { expiresIn: "1d" };
  const token = jwt.sign(payload, privateKey, options);
  return token;
};
