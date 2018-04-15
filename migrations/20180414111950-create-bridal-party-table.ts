import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('BridalParties', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			firstName: Sequelize.STRING,
			lastName: Sequelize.STRING,
			comment: Sequelize.STRING,
			imageId: Sequelize.UUID,
			partyRoleId: Sequelize.INTEGER,
			subRole: Sequelize.STRING,
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

	down: (queryInterface: QueryInterface) => {
		return queryInterface.dropTable('BridalParties');
	},
};
