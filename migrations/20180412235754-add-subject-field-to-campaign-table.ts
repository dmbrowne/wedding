import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('Campaigns', 'subject', { type: Sequelize.STRING });
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('Campaigns', 'subject');
	},
};