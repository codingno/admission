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
  const StudentTemp = sequelize.define(
    "student_temp",
    {
      // user_id: DataTypes.STRING,
      name: DataTypes.STRING,
      entry_year: DataTypes.INTEGER,
      departement: DataTypes.INTEGER,
      faculty: DataTypes.INTEGER,
      financial_type_id: DataTypes.INTEGER,
      email: DataTypes.STRING,
      nationality: {
        type: DataTypes.ENUM,
        values: ["WNI", "WNA"],
        defaultValue: "WNI",
      },
      generate: DataTypes.BOOLEAN,
			place_of_birth: DataTypes.STRING,
			date_of_birth: DataTypes.DATE,
			gender: {
				type: DataTypes.ENUM,
					values: [
						'MAN',
						'WOMAN',
					],
					defaultValue: 'MAN',
			},
			nationality: {
				type: DataTypes.ENUM,
					values: [
						'WNI',
						'WNA',
					],
					defaultValue: 'WNI',
			},
			identity_id: DataTypes.STRING,
			identity_type_id: DataTypes.INTEGER,
			religion : DataTypes.INTEGER,
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
      status: DataTypes.INTEGER,
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
      modelName: "student_temp",
      freezeTableName: true,
    }
  );
  return StudentTemp;
};
