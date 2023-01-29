'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class UserSecret extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
	// 		// UserSecret.belongsTo(models.users)
	// 		// models.users.hasMany(UserSecret, { as: 'user_secret', foreignKey : 'user_id' });
  //   }
  // };
  // UserSecret.init({
  const UserSecret = sequelize.define('user_secret',{
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
    pass: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    email_token: DataTypes.STRING,
    email_token_expired: DataTypes.DATE,
    reset_pass_token: DataTypes.STRING,
    reset_pass_expired: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'user_secret',
  });
  return UserSecret;
};