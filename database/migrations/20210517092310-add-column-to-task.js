'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'creatorId', {
      allowNull: false,
      type: Sequelize.INTEGER
    }),
    await queryInterface.addColumn('Tasks', 'assigneeId', {
      type: Sequelize.INTEGER
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'createId'),
    await queryInterface.removeColumn('Tasks', 'assigneeId');
  }
};
