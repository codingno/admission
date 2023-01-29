'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('DocumentUpload', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    name: {type: Sequelize.STRING},
    filename: {type: Sequelize.STRING},
    url_link: {type: Sequelize.STRING},
    is_relevance: {type: Sequelize.BOOLEAN},
    notes: {type: Sequelize.STRING},
    verifier: {type: Sequelize.INTEGER},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'document_upload',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
  }
  return model;
};