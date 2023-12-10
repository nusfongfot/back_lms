const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const privateKey = process.env.JSONWEB_SECRET;
    const payload = jwt.verify(token, privateKey);
    const userId = payload.userId;

    if (userId.role !== "instructor") {
      return res
        .status(400)
        .json({
          message: "You not instructor please sign up for become instructor",
        });
    }
    next();
  } catch (error) {
    next(error);
    console.log(error);
  }
};
