'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
      Category.hasMany(models.Budget, { foreignKey: 'categoryId', as: 'budgets' });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.ENUM('INCOME', 'EXPENSE'),
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};