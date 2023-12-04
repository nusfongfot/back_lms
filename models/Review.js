const connect_db = require("../connect_db");
const { DataTypes } = require("sequelize");

const ReviewModal = connect_db.define("reviews", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
  },
  star: {
    type: DataTypes.BIGINT,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
  courseId: {
    type: DataTypes.BIGINT,
  },
});

ReviewModal.sync({ alter: true });
module.exports = ReviewModal;
