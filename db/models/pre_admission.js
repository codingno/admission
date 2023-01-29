'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('PreAdmission', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    faculty: {type: Sequelize.STRING},
    program_study: {type: Sequelize.STRING},
    nationality: {type: Sequelize.STRING},
    gender: {type: Sequelize.STRING},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'pre_admission',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
  }
  return model;
};