const connect_db = require("../connect_db");
const { DataTypes } = require("sequelize");

const UserModel = connect_db.define("users", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
  },
  picture: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  role: {
    type: DataTypes.ENUM("user", "instructor", "admin"),
    defaultValue: "user",
  },
  stripe_account_id: {
    type: DataTypes.STRING,
  },
  stripe_seller: {
    type: DataTypes.JSON,
  },
  stripe_session: {
    type: DataTypes.JSON,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
  courses: {
    type: DataTypes.JSON,
  },
});

// UserModel.sync({ alter: true });
module.exports = UserModel;
