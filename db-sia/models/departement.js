'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class Departement extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Departement.init({
  const Departement = sequelize.define('departement',{
    faculty_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    label: DataTypes.STRING,
    study_type_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER,
		status: {
			type: DataTypes.ENUM,
        values: [
          'ACTIVE',
          'NON ACTIVE',
        ],
        defaultValue: 'ACTIVE',
		},
    course_credits: DataTypes.INTEGER,
    accreditation: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'departement',
  });
	 
  Departement.associate = (models) => {
    // Departement.belongsTo(model.master_study_type,{foreignKey: "id", targetKey: 'faculty_id'})
    // Departement.belongsTo(model.student_leave,{foreignKey: "id", targetKey: 'faculty_id'})
		Departement.belongsTo(models.master_study_type, { foreignKey: 'study_type_id', as : 'study_type' })
		Departement.belongsTo(models.faculty, { foreignKey: 'faculty_id', as : 'faculty' })
  }
  return Departement;
};