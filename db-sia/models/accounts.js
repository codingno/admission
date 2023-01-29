'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // class Account extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // Account.init({
  const Account = sequelize.define('account',{
		id : {
			type: DataTypes.UUID,
    	defaultValue: DataTypes.UUIDV4,	
			primaryKey: true,
		},
		type: DataTypes.STRING,
    provider: DataTypes.STRING,
    provider_account_id: DataTypes.STRING,
    refresh_token: DataTypes.STRING,
    access_token: DataTypes.STRING,
    expires_at: DataTypes.INTEGER,
    email_verified: DataTypes.TIME,
    token_type: DataTypes.STRING,
    scope: DataTypes.STRING,
    id_token: DataTypes.STRING,
    session_state: DataTypes.STRING,
    user_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'account',
		timestamps: false,
  });
  return Account;
};