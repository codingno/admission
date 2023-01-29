'use strict';

module.exports = (db, Sequelize) => {
  var model = db.define('DeskScore', {
    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
			autoIncrement: true,
    },
    personal_id: {type: Sequelize.INTEGER},
    aspect_id: {type: Sequelize.INTEGER},
    admin_id: {type: Sequelize.INTEGER},
    score: {type: Sequelize.INTEGER},
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'desk_score',
    logging: false,
    raw: false
  });
  model.associate = models => {
		model.belongsTo(models.Personal, { foreignKey: 'personal_id', as : 'personal' })
		model.belongsTo(models.Personal, { foreignKey: 'admin_id', as : 'admin' })
		model.belongsTo(models.Aspect, { foreignKey: 'aspect_id', as : 'aspect' })
  }
  return model;
};