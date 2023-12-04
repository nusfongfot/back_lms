const connect_db = require("../connect_db");
const { DataTypes } = require("sequelize");

const CourseModel = connect_db.define("course", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.JSON,
  },
  price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
});

// CourseModel.sync({ alter: true });
module.exports = CourseModel;
