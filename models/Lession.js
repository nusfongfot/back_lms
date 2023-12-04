const connect_db = require("../connect_db");
const { DataTypes } = require("sequelize");

const LessionModel = connect_db.define("lession", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  video: {
    type: DataTypes.TEXT,
  },
  free_preview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  courseId: {
    type: DataTypes.BIGINT,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// LessionModel.sync({ alter: true });
module.exports = LessionModel;
