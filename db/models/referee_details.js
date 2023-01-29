'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('RefereeDetail', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    title: {type: Sequelize.STRING},
    family_name: {type: Sequelize.STRING},
    given_name: {type: Sequelize.STRING},
    position: {type: Sequelize.STRING},
    relationship_to_applicant: {type: Sequelize.STRING},
    address: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING},
    phone_number: {type: Sequelize.INTEGER},
    email_address: {type: Sequelize.STRING},
    country_id: {type: Sequelize.INTEGER},
    email_token: {type: Sequelize.STRING},
    is_relevance: {type: Sequelize.BOOLEAN},
    notes: {type: Sequelize.STRING},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'referee_details',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
		model.hasMany(models.RefereeRecommendationForm, { foreignKey: 'referee_detail_id', as : 'referee_recommendation_form' })
  }
	model.beforeBulkCreate(async (records, options) => {
		try {
			for await (let user of records) {
				const email_token = await require('crypto').randomBytes(32).toString('hex');
				user.email_token = email_token
			}
		} catch (error) {
    	console.log(`🚀 ~ file: user.js ~ line 66 ~ model.beforeBulkCreate ~ error`, error)
		}
	})
	model.beforeCreate(async (user, options) => {
		try {
			// for await (let user of records) {
        // const password = Math.random().toString(36).substr(2, 8);
				// const email_token = await hashPassword(username)
				const email_token = await require('crypto').randomBytes(32).toString('hex');
				user.email_token = email_token
			// }
		} catch (error) {
    	console.log(`🚀 ~ file: user.js ~ line 66 ~ model.beforeBulkCreate ~ error`, error)
		}
	})
  return model;
};