'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('Personal', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    name: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING},
    role_id: {type: Sequelize.INTEGER},
    submitted: {type: Sequelize.BOOLEAN},
    is_verified: {type: Sequelize.BOOLEAN},
    desk_review_score: {type: Sequelize.INTEGER},
    interview_score: {type: Sequelize.INTEGER},
    // created_at: {type: Sequelize.DATE},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'personal',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.hasMany(models.PersonalSecret, { foreignKey: 'personal_id', as : 'personal_secret' })
		model.hasMany(models.PersonalDetail, { foreignKey: 'personal_id', as : 'personal_detail' })
		model.hasMany(models.ContactDetail, { foreignKey: 'personal_id', as : 'contact_detail' })
		model.hasMany(models.FinancialSupport, { foreignKey: 'personal_id', as : 'financial_support' })
		model.hasMany(models.ProposedStudy, { foreignKey: 'personal_id', as : 'proposed_study' })
		model.hasMany(models.EducationBackground, { foreignKey: 'personal_id', as : 'education_background' })
		model.hasMany(models.LanguageAbility, { foreignKey: 'personal_id', as : 'language_ability' })
		model.hasMany(models.LanguageScore, { foreignKey: 'personal_id', as : 'language_score' })
		model.hasMany(models.JobStatus, { foreignKey: 'personal_id', as : 'job_status' })
		model.hasMany(models.RefereeDetail, { foreignKey: 'personal_id', as : 'referee_detail' })
		model.hasMany(models.DocumentUpload, { foreignKey: 'personal_id', as : 'document_upload' })
		model.hasMany(models.DeskScore, { foreignKey: 'personal_id', as : 'desk_score' })
		model.hasMany(models.InterviewScore, { foreignKey: 'personal_id', as : 'interview_score_personal' })
  }
  return model;
};