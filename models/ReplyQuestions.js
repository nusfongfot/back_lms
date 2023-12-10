const connect_db = require("../connect_db");
const { DataTypes } = require("sequelize");

const ReplyQuestions = connect_db.define("reply", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.BIGINT,
  },
  details: {
    type: DataTypes.STRING,
  },
  questionId: {
    type: DataTypes.BIGINT,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
});

// ReplyQuestions.sync({ alter: true });
module.exports = ReplyQuestions;
