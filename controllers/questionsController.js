const CourseModel = require("../models/Course");
const UserModel = require("../models/User");
const QuestionsModel = require("../models/Questions");
const ReplyQuestionsModel = require("../models/ReplyQuestions");
const verifyMemberServices = require("../services/verifyMember");

exports.createQuestion = async (req, res, next) => {
  try {
    const { courseId, title, details } = req.body;
    const memberEmail = await verifyMemberServices.checkUserId(req);
    const userId = memberEmail.id;

    if (!courseId)
      return res.status(400).json({ message: "courseId is required!" });
    if (!title) return res.status(400).json({ message: "title is required!" });
    if (!details)
      return res.status(400).json({ message: "details is required!" });
    const data = await QuestionsModel.create({
      courseId,
      title,
      details,
      userId,
    });
    return res.json({ message: "create question successfully", data });
  } catch (error) {
    next(error);
  }
};

exports.replyQuestionByInStructor = async (req, res, next) => {
  try {
    const { courseId, userId, details, questionId } = req.body;

    if (!courseId)
      return res.status(400).json({ message: "courseId is required!" });
    if (!questionId)
      return res.status(400).json({ message: "questionId is required!" });
    if (!userId)
      return res.status(400).json({ message: "userId is required!" });
    if (!details)
      return res.status(400).json({ message: "details is required!" });
    const data = await ReplyQuestionsModel.create(req.body);
    return res.json({ message: "reply question successfully", data });
  } catch (error) {
    next(error);
  }
};

exports.getAllQuestionsOfCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    QuestionsModel.hasMany(ReplyQuestionsModel);
    QuestionsModel.belongsTo(UserModel);
    ReplyQuestionsModel.belongsTo(UserModel);
    
    const data = await QuestionsModel.findAll({
      include: [
        {
          model: ReplyQuestionsModel,
          include: [
            {
              model: UserModel,
              attributes: ["id", "name", "email", "picture"],
            },
          ],
        },
        {
          model: UserModel,
          attributes: ["id", "name", "email", "picture"],
        },
      ],
      where: {
        courseId: id,
      },
      order: [["id", "DESC"]],
    });
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};
