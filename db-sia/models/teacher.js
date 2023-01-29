'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class Teacher extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Teacher.init({
  const Teacher = sequelize.define('teacher',{
    // user_id: DataTypes.STRING,
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			},
			onDelete: "CASCADE"
		},
    ein: DataTypes.STRING,
    nidn_code: DataTypes.INTEGER,
    title: DataTypes.STRING,
    departement_id: DataTypes.INTEGER,
    marriage_status: {
      type: DataTypes.ENUM,
      values: ["MARRY", "SINGLE"],
      defaultValue: "SINGLE",
    },
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'teacher',
  });
  return Teacher;
};