const LessionModel = require("../models/Lession");
const CourseModel = require("../models/Course");
const UserModel = require("../models/User");

exports.getCourseUserById = async (req, res, next) => {
  //for watch single course
  try {
    const id = req.params.id;

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
