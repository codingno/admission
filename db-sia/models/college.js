'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class College extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // College.init({
  const College = sequelize.define('college',{
    pt_code: DataTypes.INTEGER,
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    address_1: DataTypes.STRING,
    address_2: DataTypes.STRING,
    city: DataTypes.STRING,
    post_code: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    fax: DataTypes.STRING,
    decision_letter: DataTypes.STRING,
    since: DataTypes.TIME,
    email: DataTypes.STRING,
    site: DataTypes.STRING,
    pt_start_date: DataTypes.TIME,
  }, {
    sequelize,
    modelName: 'college',
		freezeTableName: true,
  });
  return College;
};