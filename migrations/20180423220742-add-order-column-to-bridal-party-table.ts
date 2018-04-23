import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('BridalParties', 'order', {
			type: Sequelize.INTEGER,
			defaultValue: 1,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('BridalParties', 'order');
	},
};
