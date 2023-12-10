const LessionModel = require("../models/Lession");
const CourseModel = require("../models/Course");
const UserModel = require("../models/User");
const verifyMemberServices = require("../services/verifyMember");
const { Sequelize, Op } = require("sequelize");
const LessonsCompleted = require("../models/Lession_Completed");

exports.getCourseUserById = async (req, res, next) => {
  //for watch single course
  try {
    const id = req.params.id;
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    const user = await UserModel.findOne({
      attributes: ["courses"],
      where: {
        email: memberEmail,
      },
    });
    const userCourse = user?.courses?.find((item) => item.id == id);
    if (!userCourse)
      return res
        .status(403)
        .json({ message: "You don't have permission for this course" });

    CourseModel.hasMany(LessionModel);
    const course = await CourseModel.findOne({
      include: {
        model: LessionModel,
        where: {
          deleted: false,
        },
        // required: false,
      },
      where: {
        id: id,
        deleted: false,
        published: true,
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "the course is currently closed for maintenance." });
    }
    return res.send({ data: course });
  } catch (error) {
    next(error);
  }
};

exports.completeLessonById = async (req, res, next) => {
  try {
    const { lessonId, courseId, completed } = req.body;
    const course = await CourseModel.findOne({
      where: {
        id: courseId,
        deleted: false,
      },
    });
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }

    const lessons = await LessionModel.update(
      {
        completed: completed,
      },
      {
        where: {
          id: lessonId,
          deleted: false,
        },
      }
    );
    if (lessons == 0) {
      return res.status(404).json({ message: "lessons not found" });
    }
    return res.send({ message: "mark complete successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getDetailCourseBrowse = async (req, res, next) => {
  try {
    const id = req.params.id;

    CourseModel.belongsTo(UserModel);
    const data = await CourseModel.findOne({
      include: [
        {
          model: UserModel,
          attributes: ["name", "email"],
        },
      ],
      where: {
        id: id,
        deleted: false,
        published: true,
      },
    });
    if (!data) {
      return res.status(404).json({ message: "course not found" });
    }
    const lessons = await LessionModel.findAll({
      where: {
        courseId: id,
        deleted: false,
      },
    });
    return res.json({ data, lessons });
  } catch (error) {
    next(error);
  }
};

exports.searchCourse = async (req, res, next) => {
  try {
    const { q } = req.query;
    CourseModel.belongsTo(UserModel);
    const data = await CourseModel.findAll({
      include: {
        model: UserModel,
        attributes: ["name", "email"],
        required: false,
      },
      order: [["id", "DESC"]],
      where: {
        [Op.or]: [
          Sequelize.literal("LOWER(course.name) LIKE :query"),
          {
            name: {
              [Op.substring]: q.toLowerCase(),
            },
          },
        ],
      },
      replacements: { query: `%${q.toLowerCase()}%` },
    });

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

exports.filterCourse = async (req, res, next) => {
  try {
    const { type, cate } = req.query;
    CourseModel.belongsTo(UserModel);

    const whereClause = {
      deleted: false,
    };

    // Conditionally add the price filter
    if (type !== undefined && type !== "") {
      whereClause.price = type === "free" ? 0 : { [Op.gt]: 0 };
    }

    // Conditionally add the category filter
    if (cate !== undefined && cate !== "") {
      whereClause.category = cate;
    }

    const data = await CourseModel.findAll({
      include: {
        model: UserModel,
        attributes: ["name", "email"],
        required: false,
      },
      order: [["id", "DESC"]],
      where: whereClause,
    });
    return res.send({ data });
  } catch (error) {
    next(error);
  }
};

exports.completeLessonOfUser = async (req, res, next) => {
  try {
    const { courseId, userId, lessionId, completed } = req.body;
    if (!courseId)
      return res.status(400).json({ message: "courseId is required!" });
    if (!userId)
      return res.status(400).json({ message: "courseId is required!" });
    if (!lessionId)
      return res.status(400).json({ message: "lessionId is required!" });
    if (!completed)
      return res.status(400).json({ message: "completed is required!" });
    const data = await LessonsCompleted.create(req.body);
    return res.json({ message: "completed successfully", data });
  } catch (error) {
    next(error);
  }
};
exports.getCompleteLessonOfUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const memberEmail = await verifyMemberServices.checkUserId(req);
    const userId = memberEmail.id;
    LessonsCompleted.belongsTo(LessionModel);
    const data = await LessonsCompleted.findAll({
      include: {
        model: LessionModel,
        attributes: ["name"],
      },
      where: {
        courseId: id,
        completed: true,
        userId: userId,
      },
    });
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};
