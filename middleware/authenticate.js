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

    const findUser = await UserModel.findAll({
      where: {
        email: userId.email,
      },
      attributes: { exclude: ["password"] },
    });

    if (findUser.length == 0) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    next();
  } catch (error) {
    next(error);
    console.log(error);
  }
};
