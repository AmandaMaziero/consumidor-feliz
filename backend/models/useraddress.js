'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserAddress.belongsTo(models.User, {
        foreignKey: 'iduser',
        as: 'User'
      })
      UserAddress.belongsTo(models.Address, {
        foreignKey: 'idaddress',
        as: 'Address'
      })
    }
  }
  UserAddress.init({
    iduser: DataTypes.INTEGER,
    idaddress: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'userAddresses'
  });
  return UserAddress;
};