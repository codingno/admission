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
  const Info = sequelize.define(
    "info",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      position: {
        type: DataTypes.ENUM,
        values: ["Calendar", "Guides", "News"],
        defaultValue: "News",
      },
      source: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "info",
      freezeTableName: true,
    }
  );
  return Info;
};
