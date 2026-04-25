'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BudgetTemplate extends Model {
    static associate(models) {
      BudgetTemplate.belongsTo(models.User, { foreignKey: 'userId' });
      BudgetTemplate.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    }
  }
  BudgetTemplate.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'BudgetTemplate',
  });
  return BudgetTemplate;
};
