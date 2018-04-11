import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('Events', 'entryTime', {
			type: Sequelize.DATE,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('Events', 'entryTime');
	},
};
