'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservas', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservas', 'createdAt');
  },
};
