"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class Student extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The models/index file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Student.init({
  const AcademicSchedule = sequelize.define(
    "academic_schedule",
    {
      academic_year_id: DataTypes.INTEGER,
      departement_id: DataTypes.INTEGER,
      course_id: DataTypes.INTEGER,
      day_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
      teacher_id: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "academic_schedule",
	    freezeTableName: true,
    }
  );
  return AcademicSchedule;
};
