import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('Donations', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			message: {
				type: Sequelize.TEXT,
			},
			amount: Sequelize.INTEGER,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.dropTable('Donations');
	},
};
