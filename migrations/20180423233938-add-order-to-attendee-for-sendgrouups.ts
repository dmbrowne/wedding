import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('Attendees', 'sendGroupOrder', {
			type: Sequelize.INTEGER,
			defaultValue: 1,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('Attendees', 'sendGroupOrder');
	},
};
