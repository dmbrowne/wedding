import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('Events', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			description: Sequelize.STRING,
			startTime: Sequelize.DATE,
			endTime: Sequelize.DATE,
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Events');
	},
};
