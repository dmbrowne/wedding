import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('BridalParties', 'vip', Sequelize.BOOLEAN);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('BridalParties', 'vip');
	},
};
