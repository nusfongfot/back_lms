const connect_db = require("../connect_db");
const { DataTypes } = require("sequelize");

const LessonsCompleted = connect_db.define("lessons_completed", {
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
  lessionId: {
    type: DataTypes.BIGINT,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// LessonsCompleted.sync({ alter: true });
module.exports = LessonsCompleted;
