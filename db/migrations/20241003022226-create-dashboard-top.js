"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE VIEW dashboard_top AS
      SELECT
        0 register,
        0 submitted,
        0 verified
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      "DROP VIEW IF EXISTS dashboard_top ;"
    );
  },
};
