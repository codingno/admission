"use strict";
module.exports = {
  development: {
    username: process.env.DB_USER_SIA,
    password: process.env.DB_PASS_SIA,
    database: process.env.DB_NAME_SIA,
    host: process.env.DB_HOST_SIA,
    dialect: "mysql",
		logging: true,
  },
  test: {
    username: process.env.DB_USER_SIA,
    password: process.env.DB_PASS_SIA,
    database: process.env.DB_NAME_SIA,
    host: process.env.DB_HOST_SIA,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER_SIA,
    password: process.env.DB_PASS_SIA,
    database: process.env.DB_NAME_SIA,
    host: process.env.DB_HOST_SIA,
    dialect: "mysql",
    // dialectOptions: {
    //   ssl: true,
    // },
		logging: false,
  },
};