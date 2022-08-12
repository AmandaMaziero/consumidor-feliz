'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Store.init({
    cnpj: DataTypes.STRING,
    fantasyName: DataTypes.STRING,
    corporateName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    stateRegistration: DataTypes.STRING,
    municipalRegistration: DataTypes.STRING,
    cnae: DataTypes.STRING,
    description: DataTypes.STRING,
    companySize: DataTypes.INTEGER,
    telephone: DataTypes.STRING,
    cell: DataTypes.STRING,
    quality: DataTypes.FLOAT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};