'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class CourseSelection extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // CourseSelection.init({
  const CourseSelection = sequelize.define('course_selection',{
    departement_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    grade: DataTypes.STRING,
    grade_number: DataTypes.INTEGER,
    class_type_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'course_selection',
  });
  return CourseSelection;
};