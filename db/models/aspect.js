'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('Aspect', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    name: {type: Sequelize.STRING},
    type: {type: Sequelize.INTEGER},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'aspect',
    logging: false,
    raw: false
  });
  return model;
};