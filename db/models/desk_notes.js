'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('DeskNotes', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    admin_id: {type: Sequelize.INTEGER},
    notes: {type: Sequelize.STRING},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'desk_notes',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
		model.belongsTo(models.Personal, { foreignKey: 'admin_id', as : 'admin' })
  }
  return model;
};