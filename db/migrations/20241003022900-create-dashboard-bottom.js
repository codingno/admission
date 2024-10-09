"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE VIEW dashboard_bottom AS
      SELECT
        0 inteviewed,
        0 passed
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      "DROP VIEW IF EXISTS dashboard_bottom ;"
    );
  },
};
