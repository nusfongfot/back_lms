const jwt = require("jsonwebtoken");

exports.verifyUserId = async (req) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const privateKey = process.env.JSONWEB_SECRET;
  const payload = jwt.verify(token, privateKey);
  const userId = payload.userId;
  return userId.email;
};

exports.checkUserId = async (req) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const privateKey = process.env.JSONWEB_SECRET;
  const payload = jwt.verify(token, privateKey);
  const userId = payload.userId;
  return userId;
};

