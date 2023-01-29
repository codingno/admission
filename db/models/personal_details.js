'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('PersonalDetail', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    tittle: {type: Sequelize.STRING},
    family_name: {type: Sequelize.STRING},
    given_name: {type: Sequelize.STRING},
    place_of_birth: {type: Sequelize.STRING},
    date_of_birth: {type: Sequelize.DATE},
    gender: {type: Sequelize.STRING},
    country_citizen: {type: Sequelize.STRING},
    national_identity_number: {type: Sequelize.INTEGER},
    passport_no: {type: Sequelize.INTEGER, allowNull : true},
    issue_date: {type: Sequelize.DATE, allowNull : true},
    expiry_date: {type: Sequelize.DATE, allowNull : true},
    country_id: {type: Sequelize.INTEGER, allowNull : true},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'personal_details',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
  }
  return model;
};