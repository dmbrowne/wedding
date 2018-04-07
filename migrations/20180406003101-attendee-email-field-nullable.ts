import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.changeColumn('Users', 'email', {
			type: Sequelize.STRING,
			allowNull: false,
		});
		await queryInterface.changeColumn('Attendees', 'email', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	down: async(queryInterface: QueryInterface) => {
		await queryInterface.changeColumn('Users', 'email', {
			type: Sequelize.STRING,
			allowNull: true,
		});
		await queryInterface.changeColumn('Attendees', 'email', {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},
};