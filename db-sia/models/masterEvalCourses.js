"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class MasterEvalCourses extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // MasterEvalCourses.init({
  const MasterEvalCourses = sequelize.define(
    "master_eval_courses",
    {
      question: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "master_eval_courses",
      freezeTableName: true,
    }
  );
  return MasterEvalCourses;
};
