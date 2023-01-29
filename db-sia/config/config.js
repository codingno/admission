"use strict";
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_SIA,
    host: process.env.DB_HOST,
    dialect: "mysql",
		logging: true,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_SIA,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_SIA,
    host: process.env.DB_HOST,
    dialect: "mysql",
    // dialectOptions: {
    //   ssl: true,
    // },
		logging: false,
  },
};