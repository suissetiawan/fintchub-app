'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Transaction.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    }
  }
  Transaction.init({
    description: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    type: DataTypes.STRING,
    date: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};