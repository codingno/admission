'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class IdentityType extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // IdentityType.init({
  const IdentityType = sequelize.define('religion',{
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'religion',
	freezeTableName: true,
  });
  return IdentityType;
};