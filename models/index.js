const dbConfig = require("../dbconnection");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user1.js")(sequelize, Sequelize);
db.contact = require("./contact.js")(sequelize, Sequelize);
db.team = require("./team.js")(sequelize, Sequelize);
db.email = require("./email.js")(sequelize, Sequelize);
db.setting = require("./setting.js")(sequelize, Sequelize);
db.esetting = require("./esetting.js")(sequelize, Sequelize);
db.email_teams = require("./email_teams.js")(sequelize, Sequelize);

module.exports = sequelize;
module.exports = db;
