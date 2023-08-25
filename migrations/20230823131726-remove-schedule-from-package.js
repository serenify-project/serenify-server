'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Packages', 'schedule');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Packages', 'schedule', {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Schedule is required" },
        notEmpty: { msg: "Schedule is required" },
      },
    });
  }
};