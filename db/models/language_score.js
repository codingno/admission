'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('LanguageScore', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    test_name: {type: Sequelize.STRING},
    date_test_taken: {type: Sequelize.DATE},
    overall_score: {type: Sequelize.INTEGER},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'language_score',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
  }
  return model;
};