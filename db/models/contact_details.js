'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('ContactDetail', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    address_1: {type: Sequelize.STRING},
    address_2: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    postal_code: {type: Sequelize.STRING},
    province: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING},
    country_id: {type: Sequelize.INTEGER},
    home_number: {type: Sequelize.STRING},
    mobile_number: {type: Sequelize.STRING},
    work_number: {type: Sequelize.STRING},
    primary_email: {type: Sequelize.STRING},
    alternate_email: {type: Sequelize.STRING},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'contact_detail',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
  }
  return model;
};