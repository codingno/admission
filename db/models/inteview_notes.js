'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('InterviewNotes', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    teacher_id: {type: Sequelize.INTEGER},
    notes: {type: Sequelize.STRING},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'interview_notes',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
		model.belongsTo(models.Personal, { foreignKey: 'teacher_id', as : 'teacher' })
  }
  return model;
};