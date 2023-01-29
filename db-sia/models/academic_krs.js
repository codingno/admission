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
  const AcademicKrs = sequelize.define(
    "academic_krs",
    {
      student_number: DataTypes.STRING,
      schedule_id: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      grade_id: DataTypes.INTEGER,
      confirm: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "academic_krs",
	    freezeTableName: true,
    }
  );
  return AcademicKrs;
};
