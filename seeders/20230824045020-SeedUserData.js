'use strict';

const { hashPassword } = require('../helpers/bcrypt');
const users = require("../db/users.json")
users.forEach((user) => {
  // user.role = "Admin"
  user.password = hashPassword(user.password)
  user.createdAt = user.updatedAt = new Date()
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("Users", users, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", users, {})
  }
};
