'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class MasterTeacherStatus extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // MasterTeacherStatus.init({
  const MasterTeacherStatus = sequelize.define('master_teacher_status',{
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'master_teacher_status',
		freezeTableName: true,
  });
  return MasterTeacherStatus;
};