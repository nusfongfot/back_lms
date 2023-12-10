const connect_db = require("../connect_db");
const { DataTypes } = require("sequelize");

const Questions = connect_db.define("questions", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.BIGINT,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
  title: {
    type: DataTypes.STRING,
  },
  details: {
    type: DataTypes.STRING,
  },
  replyId: {
    type: DataTypes.BIGINT,
  },
});

// Questions.sync({ alter: true });
module.exports = Questions;
