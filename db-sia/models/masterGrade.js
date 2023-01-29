'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class MasterCourseType extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // MasterCourseType.init({
  const MasterGrade = sequelize.define('master_grade',{
    grade: DataTypes.STRING,
    point: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'master_grade',
		freezeTableName: true,
  });
  return MasterGrade;
};