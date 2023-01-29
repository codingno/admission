"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  // class Student extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Student.init({
  const Student = sequelize.define(
    "student",
    {
      // user_id: DataTypes.STRING,
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      student_number: DataTypes.STRING,
      teacher_id: DataTypes.INTEGER,
      entry_year: DataTypes.INTEGER,
      entry_semester: {
        type: DataTypes.ENUM,
        values: ["1", "2"],
        defaultValue: "1",
      },
      entry_status: {
        type: DataTypes.ENUM,
        values: ["NEW", "TRANSFER"],
        defaultValue: "NEW",
      },
      departement_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      financial_type_id : DataTypes.INTEGER,
      mother_name: DataTypes.STRING,
      father_name: DataTypes.STRING,
      father_income: DataTypes.INTEGER,
      mother_income: DataTypes.INTEGER,
      school_name: DataTypes.STRING,
      school_telp: DataTypes.STRING,
      school_address: DataTypes.STRING,
      school_departement: DataTypes.STRING,
      school_end: DataTypes.INTEGER,
      campus_name: DataTypes.STRING,
      campus_telp: DataTypes.STRING,
      campus_address: DataTypes.STRING,
      campus_departement: DataTypes.STRING,
      campus_end: DataTypes.INTEGER,
      institution_name: DataTypes.STRING,
      institution_telp: DataTypes.STRING,
      institution_address: DataTypes.STRING,
      institution_start: DataTypes.INTEGER,
      institution_end: DataTypes.INTEGER,
      semester_active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "student",
    }
  );
  return Student;
};
