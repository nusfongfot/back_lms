const CourseModel = require("../models/Course");
const LessionModel = require("../models/Lession");
const LessonsCompletedModel = require("../models/Lession_Completed");
const UserModel = require("../models/User");
const verifyMemberServices = require("../services/verifyMember");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getAllCourse = async (req, res, next) => {
  try {
    CourseModel.belongsTo(UserModel);
    CourseModel.hasMany(LessionModel);
    const data = await CourseModel.findAll({
      include: [
        {
          model: LessionModel,
          attributes: ["id", "name", "content", "video", "free_preview"],
          where: {
            deleted: false,
          },
        },
        {
          model: UserModel,
          attributes: ["name", "email"],
        },
      ],

      where: {
        deleted: false,
        published: true,
      },
    });
    return res.json({ data });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const { name, description, image, category, userId } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required!" });
    }
    if (!description) {
      return res.status(400).json({ message: "description is required!" });
    }
    if (!image) {
      return res.status(400).json({ message: "image is required!" });
    }
    if (!category) {
      return res.status(400).json({ message: "category is required!" });
    }
    if (!userId) {
      return res.status(400).json({ message: "userId is required!" });
    }
    const data = await CourseModel.create(req.body);
    return res.json({ message: "create course successfully", data });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, category } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required!" });
    }
    if (!description) {
      return res.status(400).json({ message: "description is required!" });
    }
    if (!image) {
      return res.status(400).json({ message: "image is required!" });
    }
    if (!category) {
      return res.status(400).json({ message: "category is required!" });
    }

    const data = await CourseModel.findOne({ where: { id: id } });
    if (data == null) {
      return res.status(404).json({ message: "course not found" });
    }
    await CourseModel.update(req.body, {
      where: {
        id: id,
      },
    });
    return res.json({ message: "update course successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.deleteCourseById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const findCourse = await CourseModel.findOne({
      where: {
        id: id,
      },
    });
    if (!findCourse) {
      return res.status(404).json({ message: "course not found to delete" });
    }
    await CourseModel.update(
      {
        deleted: true,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.json({ message: "deleted successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // CourseModel.belongsTo(UserModel);
    // CourseModel.hasMany(LessionModel);
    // const data = await CourseModel.findOne({
    //   include: [
    //     {
    //       model: UserModel,
    //       attributes: ["name", "email"],
    //     },
    //     {
    //       model: LessionModel,
    //       attributes: ["id", "name", "content", "video", "free_preview"],
    //       where: {
    //         deleted: false,
    //       },
    //     },
    //   ],
    //   where: { id: id },
    // }).catch((err) => res.send(err));

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
      },
    });

    const lessons = await LessionModel.findAll({
      where: {
        courseId: id,
        deleted: false,
      },
    });
    return res.json({ data, lessons });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateCoursePublish = async (req, res, next) => {
  try {
    const { publish, unpublish } = req.query;

    if (publish) {
      await CourseModel.update(
        {
          published: true,
        },
        {
          where: {
            id: publish,
          },
        }
      );
      return res.send({ message: "course publish successfully" });
    } else {
      await CourseModel.update(
        {
          published: false,
        },
        {
          where: {
            id: unpublish,
          },
        }
      );
      return res.send({ message: "course unpublish successfully" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.addLession = async (req, res, next) => {
  try {
    const { name, content, video, userId, courseId, free_preview } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required!" });
    }
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required!" });
    }
    if (!name) {
      return res.status(400).json({ message: "name is required!" });
    }
    if (!content) {
      return res.status(400).json({ message: "content is required!" });
    }
    if (!video) {
      return res.status(400).json({ message: "video is required!" });
    }
    const data = await LessionModel.create(req.body);
    return res.json({ message: "lession added", data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getLession = async (req, res, next) => {
  try {
    const { courseId, userId } = req.query;

    LessionModel.belongsTo(CourseModel);
    const data = await LessionModel.findAll({
      include: {
        model: CourseModel,
        where: {
          id: courseId,
          deleted: false,
        },
        attributes: ["name"],
      },
      where: {
        userId: userId,
        deleted: false,
      },
    });
    return res.json({ data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateLession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, content, video, free_preview } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required!" });
    }
    if (!content) {
      return res.status(400).json({ message: "content is required!" });
    }
    if (!video) {
      return res.status(400).json({ message: "video is required!" });
    }

    await LessionModel.update(req.body, {
      where: {
        id: id,
      },
    });
    return res.json({ message: "lesson update successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    await LessionModel.update(
      {
        deleted: true,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.json({ message: "delete successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.checkEnrollment = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const memberEmail = await verifyMemberServices.verifyUserId(req);

    const course = await CourseModel.findOne({
      where: {
        id: courseId,
        deleted: false,
        price: 0,
      },
      attributes: { exclude: ["deleted", "userId", "createdAt", "updatedAt"] },
    });

    if (!course) {
      return res.status(404).json({ message: "course not free" });
    }
    const user = await UserModel.findOne({
      where: {
        email: memberEmail,
      },
      attributes: { exclude: ["password"] },
    });

    // หาก่อน ว่ามี คอร์ส หรือยัง
    const currentCourses = user.getDataValue("courses") || [];
    const findIdCurrentCourses = currentCourses.filter(
      (item) => item?.id == courseId
    );
    if (findIdCurrentCourses.length > 0) {
      return res.status(400).json({ message: "you alread enroll this course" });
    }

    const updatedCourses = [...currentCourses, course];

    await UserModel.update(
      {
        courses: updatedCourses,
      },
      {
        where: {
          email: memberEmail,
        },
      }
    );

    return res.json({ message: "enrollment succussfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.paidEnrollment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const memberEmail = await verifyMemberServices.verifyUserId(req);
    CourseModel.belongsTo(UserModel);
    //check if course is free or paid
    const course = await CourseModel.findOne({
      include: {
        model: UserModel,
        attributes: ["stripe_account_id"],
        required: false,
      },
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!course) return res.status(404).json({ message: "course not found" });

    //application fee 30%
    const fee = (course.price * 0.3).toFixed(2);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // purchase details
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(course.price.toFixed(2) * 100),
            product_data: {
              name: course.name,
            },
          },
          // price: Math.round(course.price.toFixed(2) * 100),
          quantity: 1,
        },
      ],
      //charge buyer and transfer remaining balance to seller (after fee)
      ///* need to have user.stripe_account_id for use payment_intent_data */
      payment_intent_data: {
        application_fee_amount: Math.round(fee * 100),
        transfer_data: {
          destination: course.user.stripe_account_id,
        },
      },
      mode: "payment",
      // redirect url after successfully payment
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${course.id}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
    });
    await UserModel.update(
      {
        stripe_session: session,
      },
      {
        where: {
          email: memberEmail,
        },
      }
    );
    return res.send({ message: "payment successfully", data: session.id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.stripeSuccess = async (req, res, next) => {
  try {
    const id = req.params.id;
    const memberEmail = await verifyMemberServices.verifyUserId(req);

    const course = await CourseModel.findOne({
      where: {
        id: id,
        deleted: false,
      },
    });
    const user = await UserModel.findOne({
      where: {
        email: memberEmail,
      },
    });

    const currentCourses = user.getDataValue("courses") || [];

    if (!user.stripe_session) {
      return res.status(400).json({ message: "stripe_session is invalid" });
    }

    //restrive stripe session
    const session = await stripe.checkout.sessions.retrieve(
      user.stripe_session.id
    );

    // if session payment status is paid, push course to user's course[]
    if (session.payment_status == "paid") {
      const updatedCourse = [course, ...currentCourses];
      await UserModel.update(
        {
          courses: updatedCourse,
          stripe_session: {},
        },
        {
          where: {
            email: memberEmail,
          },
        }
      );
    }
    return res.json({ message: "stripe successfully", course });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
