"use strict";
import bcrypt from "bcrypt";

const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return reject(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });

module.exports = (db, Sequelize) => {
  var model = db.define(
    "PersonalSecret",
    {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      personal_id: { type: Sequelize.INTEGER },
      username: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      reset_password_token: { type: Sequelize.STRING },
      email_token: { type: Sequelize.STRING },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "personal_secret",
      logging: false,
      raw: false,
    }
  );
  model.associate = (models) => {
    model.belongsTo(models.Personal, {
      foreignKey: "personal_id",
      as: "personal",
    });
  };
  model.beforeBulkCreate(async (records, options) => {
    try {
      for await (let user of records) {
        const password = Math.random().toString(36).substr(2, 8);
        const randomNum = Math.random().toString(10).substr(2, 3);
        const hashedPassword = await hashPassword(user.password);
        user.password = hashedPassword;
        const username =
          user.username.split(" ").join().toLowerCase() + randomNum;
        user.username = username;
        if (process.env.SKIP_EMAIL !== "true") {
          const email_token = await hashPassword(username);
          user.email_token = email_token;
        }
      }
    } catch (error) {
      console.log(
        `🚀 ~ file: user.js ~ line 66 ~ model.beforeBulkCreate ~ error`,
        error
      );
    }
  });
  model.beforeCreate(async (user, options) => {
    try {
      // for await (let user of records) {
      // const password = Math.random().toString(36).substr(2, 8);
      const randomNum = Math.random().toString(10).substr(2, 3);
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
      const username =
        user.username.split(" ").join("").toLowerCase() + randomNum;
      user.username = username;
      if (process.env.SKIP_EMAIL !== "true") {
        // const email_token = await hashPassword(username)
        const email_token = await require("crypto")
          .randomBytes(32)
          .toString("hex");
        user.email_token = email_token;
      }
      // }
    } catch (error) {
      console.log(
        `🚀 ~ file: user.js ~ line 66 ~ model.beforeBulkCreate ~ error`,
        error
      );
    }
  });
  return model;
};
