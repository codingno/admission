'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('JobStatus', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    unemployed_type: {type: Sequelize.INTEGER},
    self_employee_type: {type: Sequelize.INTEGER},
    employee_type: {type: Sequelize.INTEGER},
    position_title: {type: Sequelize.STRING},
    organization_name: {type: Sequelize.STRING},
    organization_address: {type: Sequelize.STRING},
    date_commenced: {type: Sequelize.DATE},
    organization_type: {type: Sequelize.STRING},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'job_status',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
  }
  return model;
};