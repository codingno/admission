'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class Curriculum extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Curriculum.init({
  const Curriculum = sequelize.define('data_portfolio',{
    user_id: DataTypes.STRING,
    portfolio_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'portfolio',
	  freezeTableName: true,
  });
  return Curriculum;
};