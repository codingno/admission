"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class MasterTeacherScoring extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // MasterTeacherScoring.init({
  const MasterTeacherScoring = sequelize.define(
    "master_teacher_scoring",
    {
      aspect: DataTypes.STRING,
      scoring: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "master_teacher_scoring",
      freezeTableName: true,
    }
  );
  return MasterTeacherScoring;
};
