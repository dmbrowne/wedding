import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('Events', 'slug', { type: Sequelize.STRING });
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('Events', 'slug');
	},
};
