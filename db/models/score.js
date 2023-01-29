'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('Score', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    name: {type: Sequelize.STRING},
    type: {type: Sequelize.INTEGER},
    value: {type: Sequelize.INTEGER},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'score',
    logging: false,
    raw: false
  });
  return model;
};