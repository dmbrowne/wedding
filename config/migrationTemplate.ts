import Sequelize, {
  QueryInterface,
} from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    // return queryInterface.createTable('users', { id: Sequelize.INTEGER });
  },

  down: (queryInterface: QueryInterface) => {
    // return queryInterface.dropTable('users');
  },
};
