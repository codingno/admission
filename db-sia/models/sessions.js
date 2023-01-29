'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class Session extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Session.init({
  const Session = sequelize.define('session',{
		id : {
			type: DataTypes.UUID,
    	defaultValue: DataTypes.UUIDV4,	
			primaryKey: true,
		},
		espires: DataTypes.TIME,
    session_token: DataTypes.STRING,
    user_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'session',
		timestamps: false,
  });
  return Session;
};