import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('Groomsmen', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			firstName: Sequelize.STRING,
			lastName: Sequelize.STRING,
			bio: Sequelize.STRING,
			photoUrl: Sequelize.STRING,
			bestman: Sequelize.BOOLEAN,
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
		return queryInterface.dropTable('Groomsmen');
	},
};
