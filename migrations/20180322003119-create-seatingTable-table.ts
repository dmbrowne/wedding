import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('SeatingTables', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
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
		return queryInterface.dropTable('SeatingTables');
	},
};
