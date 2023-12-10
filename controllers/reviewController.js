const CourseModel = require("../models/Course");
const LessionModel = require("../models/Lession");
const UserModel = require("../models/User");
const ReviewModel = require("../models/Review");
const verifyMemberServices = require("../services/verifyMember");

exports.getReviewOfCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    ReviewModel.belongsTo(UserModel);
    const data = await ReviewModel.findAll({
      include: {
        model: UserModel,
        attributes: ["email", "name", "picture"],
      },
      where: {
        courseId: id,
      },
      order: [["id", "DESC"]],
    });
    return res.json({ data });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.getReviewByStar = async (req, res, next) => {
  try {
    const { courseId, star } = req.query;
    ReviewModel.belongsTo(UserModel);

    const data = await ReviewModel.findAll({
      include: {
        model: UserModel,
        attributes: ["email", "name", "picture"],
      },
      where: {
        star: star,
        courseId: courseId,
      },
      order: [["id", "DESC"]],
    });
    return res.json({ data });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { userId, courseId, content, star } = req.body;
    const user = await verifyMemberServices.checkUserId(req);
    const idUser = user.id;
    if (!userId)
      return res.status(400).json({ message: "userId is required!" });
    if (!courseId)
      return res.status(400).json({ message: "courseId is required!" });
    if (!content)
      return res.status(400).json({ message: "content is required!" });
    if (!star) return res.status(400).json({ message: "star is required!" });

    const findReview = await ReviewModel.findOne({
      where: {
        courseId: courseId,
        userId: idUser,
      },
    });
    if (findReview) {
      return res
        .status(400)
        .json({ message: "you already review this course" });
    }
    await ReviewModel.create(req.body);
    return res.json({ message: "review successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
