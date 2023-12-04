const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("lms_db", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  logging: false,
});
module.exports = sequelize;
