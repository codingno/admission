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
  const StudentExchange = sequelize.define(
    "student_exchange",
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
      exchange_with_university: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "student_exchange",
      freezeTableName: true,
    }
  );
  StudentExchange.associate = (model) => {
    StudentExchange.belongsTo(model.faculty, {foreignKey: 'faculty_id', as: 'faculty'})
  }
  return StudentExchange;
};
