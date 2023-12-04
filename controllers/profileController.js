const UserModel = require("../models/User");
const CourseModel = require("../models/Course");

const verifyMemberServices = require("../services/verifyMember");
const { hashedPassword } = require("../utils/auth");
const validator = require("validator");

exports.getProfile = async (req, res, next) => {
  try {
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    const user = await UserModel.findOne({
      where: { email: memberEmail },
      attributes: { exclude: ["password"] },
    });
    return res.json({ data: user });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    const memberEmail = await verifyMemberServices.verifyUserId(req);

    const hash = await hashedPassword(password);
    if (!name) return res.status(400).json({ message: "name is required!" });
    if (!email) return res.status(400).json({ message: "email is required!" });
    if (!password)
      return res.status(400).json({ message: "password is required!" });
    if (password !== confirm_password)
      return res.status(400).json({ message: "password is not matched!" });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "email is not correct!" });

    await UserModel.update(
      {
        name,
        email,
        password: hash,
      },
      {
        where: {
          email: memberEmail,
        },
      }
    );
    return res.json({ message: "update profile successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.updateImageProfile = async (req, res, next) => {
  try {
    const { picture } = req.body;
    const memberEmail = await verifyMemberServices.verifyUserId(req);

    if (!picture)
      return res.status(400).json({ message: "picture is required!" });
    await UserModel.update(
      {
        picture,
      },
      {
        where: {
          email: memberEmail,
        },
      }
    );
    return res.json({ message: "update picture successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
