'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('EducationBackground', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    degree_type: {type: Sequelize.STRING},
    institution_name: {type: Sequelize.STRING},
    province: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING},
    language: {type: Sequelize.STRING},
    graduation_date: {type: Sequelize.DATE},
    country_id: {type: Sequelize.INTEGER},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'education_background',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
  }
  return model;
};