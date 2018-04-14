import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addColumn('Events', 'venueName', Sequelize.STRING);
		await queryInterface.addColumn('Events', 'address', Sequelize.TEXT);
		await queryInterface.addColumn('Events', 'mapsLink', Sequelize.STRING);
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn('Events', 'mapsLink');
		await queryInterface.removeColumn('Events', 'address');
		await queryInterface.removeColumn('Events', 'venueName');
	},
};
