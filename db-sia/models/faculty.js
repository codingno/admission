'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class Faculty extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Faculty.init({
  const Faculty = sequelize.define('faculty',{
    college_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    accreditation: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'faculties',
  });
  
  Faculty.associate = (model) => {
    Faculty.hasMany(model.student_exchange,{foreignKey: "id", targetKey: 'faculty_id'})
    Faculty.hasMany(model.student_leave,{foreignKey: "id", targetKey: 'faculty_id'})
  }
  return Faculty;
};