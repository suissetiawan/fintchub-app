'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'type', {
      type: Sequelize.ENUM('INCOME', 'EXPENSE'),
      defaultValue: 'EXPENSE',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'type');
    // Note: To completely remove the ENUM type in Postgres or MySQL, 
    // additional commands might be needed, but usually removeColumn is sufficient for schema clean up.
  }
};
