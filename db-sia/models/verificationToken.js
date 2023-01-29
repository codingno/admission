'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class VerificationToken extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // VerificationToken.init({
  const VerificationToken = sequelize.define('verification_token',{
    token: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
    identifier: DataTypes.STRING,
		espires: DataTypes.TIME,
  }, {
    sequelize,
    modelName: 'verification_token',
		timestamps: false,
  });
  return VerificationToken;
};