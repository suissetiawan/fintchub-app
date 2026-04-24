'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static associate(models) {
      Setting.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Setting.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Setting',
  });
  return Setting;
};
