'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Budget.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Budget.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    }
  }
  Budget.init({
    amount: DataTypes.DECIMAL(15, 2),
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Budget',
  });
  return Budget;
};
