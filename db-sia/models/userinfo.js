'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class UserInfo extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
	// 		// UserInfo.belongsTo(models.users)
	// 		// models.users.hasMany(UserInfo, { as: 'user_info', foreignKey : 'user_id' });
  //   }
  // };
  // UserInfo.init({
  const UserInfo = sequelize.define('user_info',{
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
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
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
    expiredVisa: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'user_info',
		freezeTableName: true,
  });
  return UserInfo;
};