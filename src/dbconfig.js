const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("signup", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
});
const connect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(`Ma'lumotlar bazasiga ulandi`);
  } catch (e) {
    console.log(`Bazaga ulanishda xatolik yuz berdi`);
  }
};
module.exports = { connect, sequelize };
