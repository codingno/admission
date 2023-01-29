"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class MasterTeacherFeature extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // MasterTeacherFeature.init({
  const MasterTeacherFeature = sequelize.define(
    "master_teacher_feature",
    {
      aspects_id: DataTypes.INTEGER,
      features: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "master_teacher_feature",
      freezeTableName: true,
    }
  );
  return MasterTeacherFeature;
};
