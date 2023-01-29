"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class DataTeacherScoring extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // DataTeacherScoring.init({
  const DataTeacherScoring = sequelize.define(
    "data_teacher_scoring",
    {
      teacher_id: DataTypes.INTEGER,
      feature_id: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "data_teacher_scoring",
      freezeTableName: true,
    }
  );
  return DataTeacherScoring;
};
