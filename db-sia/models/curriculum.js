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
  const Curriculum = sequelize.define('curriculum',{
    departement_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    year: DataTypes.INTEGER,
    code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'curriculum',
  });
  return Curriculum;
};