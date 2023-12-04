const UserModel = require("../models/User");
const { comparePassword, hashedPassword } = require("../utils/auth");
const servicesGenToken = require("../services/genToken");
const validator = require("validator");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    const hash = await hashedPassword(password);
    if (!name) return res.status(400).json({ message: "name is required!" });
    if (!email) return res.status(400).json({ message: "email is required!" });
    if (!password)
      return res.status(400).json({ message: "password is required!" });
    if (password !== confirm_password)
      return res.status(400).json({ message: "password is not matched!" });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "email is not correct!" });

    const userExist = await UserModel.findOne({
      where: {
        email,
      },
    });
    if (userExist)
      return res.status(400).json({ message: "this email is already exists" });

    await UserModel.create({
      name,
      email,
      password: hash,
    });
    return res.status(200).json({ message: "register successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email.trim())
      return res.status(400).json({ message: "email is required!" });
    if (!password.trim())
      return res.status(400).json({ message: "password is required!" });
    const user = await UserModel.findOne({
      where: { email },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "email or password is not correct" });
    const match_pass = await comparePassword(password, user.password);
    if (!match_pass)
      return res
        .status(400)
        .json({ message: "email or password is not correct" });
    const paylod = { userId: user };
    let token = servicesGenToken.genToken(paylod);
    const data = await UserModel.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
    return res.json({ message: "login successfully", token, data });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();

    if (!email.trim())
      return res.status(400).json({ message: "email is required!" });

    const hash = await hashedPassword(shortCode);
    await UserModel.update(
      { password: hash },
      {
        where: { email: email },
      }
    );
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL_SEND_EMAIL,
        pass: process.env.GOOGLE_APP_PASS_SEND_EMAIL,
      },
    });

    var mailOptions = {
      from: '"lms_learning_help@gmail.com👻"',
      to: email,
      subject: "New Password ✔",
      text: `This is new password \n`,
      html: `
      <div>
      <h3>This is new password</h3>
      <h1 style="color:red;">${shortCode}</h1>
      </div>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) return res.send(error);
      return res.send({ message: "send email successfully" });
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
