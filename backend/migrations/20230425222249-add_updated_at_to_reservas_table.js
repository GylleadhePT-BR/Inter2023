'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservas', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservas', 'updatedAt');
  }
};
