import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('seatingTables', {
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
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('seatingTables');
	},
};
