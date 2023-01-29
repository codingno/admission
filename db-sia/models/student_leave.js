"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class IdentityType extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // IdentityType.init({
  const StudentLeave = sequelize.define(
    "student_leave",
    {
      name: DataTypes.STRING,
      student_number: DataTypes.STRING,
      faculty_id: {
        type: DataTypes.INTEGER,
        reference: {
          modelName: "faculty",
          key: "id",
        },
      },
      reason: DataTypes.STRING,
      date: DataTypes.DATE,
      approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "student_leave",
      freezeTableName: true,
    }
  );
  StudentLeave.associate = (model) => {
    StudentLeave.belongsTo(model.faculty, {foreignKey: 'faculty_id', as: 'faculty'})
  }
  return StudentLeave;
};
