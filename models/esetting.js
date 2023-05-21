module.exports = (sequelize, Sequelize) => {
  const Esetting = sequelize.define("esetting", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    host: {
      type: Sequelize.STRING,
    },
    imap: {
      type: Sequelize.INTEGER,
    },
    smpt: {
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    createdAt: { type: Date, default: Date.now },
  })
  return Esetting;
};

