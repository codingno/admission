"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class MasterEvalInstructors extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // MasterEvalInstructors.init({
  const MasterEvalInstructors = sequelize.define(
    "master_eval_instructors",
    {
      question: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "master_eval_instructors",
      freezeTableName: true,
    }
  );
  return MasterEvalInstructors;
};
