'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class Course extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Course.init({
  const Course= sequelize.define('course',{
		id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    departement_id: DataTypes.INTEGER,
    curriculum_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    // label: DataTypes.STRING,
    credits: DataTypes.INTEGER,
    theory_credits: DataTypes.INTEGER,
    practice_credits: DataTypes.INTEGER,
    practice_field_credits: DataTypes.INTEGER,
    semester: DataTypes.INTEGER,
    course_type_id: DataTypes.INTEGER,
    course_group_id: DataTypes.INTEGER,
		syllabus: {
			type: DataTypes.ENUM,
        values: [
          'AVAILABLE',
          'NOt AVAILABLE',
        ],
        defaultValue: 'AVAILABLE',
		},
		event_unit: {
			type: DataTypes.ENUM,
        values: [
          'AVAILABLE',
          'NOt AVAILABLE',
        ],
        defaultValue: 'AVAILABLE',
		},
		materials: {
			type: DataTypes.ENUM,
        values: [
          'AVAILABLE',
          'NOt AVAILABLE',
        ],
        defaultValue: 'AVAILABLE',
		},
		books: {
			type: DataTypes.ENUM,
        values: [
          'AVAILABLE',
          'NOt AVAILABLE',
        ],
        defaultValue: 'AVAILABLE',
		},
  }, {
    sequelize,
    modelName: 'course',
  });
  return Course;
};