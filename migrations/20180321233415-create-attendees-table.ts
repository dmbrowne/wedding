import { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface, Sequelize) => {
		return queryInterface.createTable('Attendees', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			email: {
				unique: true,
				allowNull: false,
				type: Sequelize.STRING,
			},
			firstName: Sequelize.STRING,
			lastName: Sequelize.STRING,
			tableId: Sequelize.UUID,
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now'),
			},
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Attendees');
	},
};
