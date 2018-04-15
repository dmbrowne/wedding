import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('Events', 'dietFeedback', Sequelize.BOOLEAN);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('Events', 'dietFeedback');
	},
};
