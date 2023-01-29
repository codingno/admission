'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('RefereeRecommendationForm', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    referee_detail_id: {type: Sequelize.INTEGER},
    intellectual_ability: {type: Sequelize.STRING},
    oral_communication_skills: {type: Sequelize.STRING},
    written_communication_skills: {type: Sequelize.STRING},
    ability_to_work: {type: Sequelize.STRING},
    ability_to_organize: {type: Sequelize.STRING},
    motivation: {type: Sequelize.STRING},
    overall_assesment: {type: Sequelize.STRING},
    recommendation: {type: Sequelize.STRING},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'referee_recommendation_form',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.RefereeDetail, { foreignKey: 'referee_detail_id', as : 'referee_detail' })
  }
  return model;
};