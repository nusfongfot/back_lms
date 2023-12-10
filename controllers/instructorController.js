const UserModel = require("../models/User");
const CourseModel = require("../models/Course");
const verifyMemberServices = require("../services/verifyMember");
const LessionModel = require("../models/Lession");
const { Sequelize, Op } = require("sequelize");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.makeInstructor = async (req, res, next) => {
  try {
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    const user = await UserModel.findOne({ where: { email: memberEmail } });
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "express" });
      user.stripe_account_id = account.id;
      await UserModel.update(
        { stripe_account_id: account.id },
        { where: { email: user.email } }
      );
    }
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT,
      return_url: process.env.STRIPE_REDIRECT,
      type: "account_onboarding",
    });
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });

    return res.json(`${accountLink.url}`);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.getAccountStatus = async (req, res, next) => {
  try {
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    const user = await UserModel.findOne({
      where: { email: memberEmail },
      attributes: { exclude: ["password"] },
    });
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    }
    await UserModel.update(
      { stripe_seller: account, role: "instructor" },
      { where: { email: user.email } }
    );

    return res.json({ data: user });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.currentInstructor = async (req, res, next) => {
  try {
    const user = await UserModel.findAll({
      where: {
        role: "instructor",
      },
      attributes: { exclude: ["password"] },
      order: [["id", "DESC"]],
    });
    return res.json({ data: user });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.getInstructorCourses = async (req, res, next) => {
  try {
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    CourseModel.belongsTo(UserModel);
    CourseModel.hasMany(LessionModel);
    const data = await CourseModel.findAll({
      include: [
        {
          model: UserModel,
          attributes: [],
          where: {
            email: memberEmail,
          },
        },
        {
          model: LessionModel,
          where: {
            deleted: false,
          },
          required: false, // Set required to false to retrieve all courses, even those without lessons
        },
      ],
      where: {
        deleted: false,
      },
      order: [["id", "DESC"]],
    });

    return res.json({ data });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.getStudentEnrolled = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findAll({
      attributes: ["courses", "id", "name", "email"],
      where: {
        courses: {
          [Op.not]: null,
        },
      },
    });

    return res.json({ data: user });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.getInstructorBalance = async (req, res, next) => {
  try {
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    const user = await UserModel.findOne({ where: { email: memberEmail } });
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    return res.json({ data: balance });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.instructorPayoutSettings = async (req, res, next) => {
  try {
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    const user = await UserModel.findOne({ where: { email: memberEmail } });
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id,
      {
        redirect_url: process.env.STRIPE_SETTINGS_REDIRECT,
      }
    );
    return res.json({ data: loginLink });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
