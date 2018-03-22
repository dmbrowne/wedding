import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    /* return queryInterface.bulkInsert('Person', [{
		 * 	name: 'John Doe',
		 * 	isBetaMember: false
		 * }], {});
		 */
  },

  down: (queryInterface: QueryInterface) => {
    // return queryInterface.bulkDelete('Person', null, {});
  },
};
