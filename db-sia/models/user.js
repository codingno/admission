'use strict';
const {
  Model
} = require('sequelize');
// module.exports = () => {
module.exports = (sequelize, DataTypes) => {
  // class User extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
	
  // User.init({
  const User = sequelize.define('user',{
		id : {
			type: DataTypes.UUID,
    	defaultValue: DataTypes.UUIDV4,	
			primaryKey: true,
		},
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    email_verified: DataTypes.TIME,
    image: DataTypes.STRING,
		role_id: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'users',
		timestamps: false,
  });
  return User;
};