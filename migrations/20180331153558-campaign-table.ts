import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('Campaigns', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			name: Sequelize.STRING,
			content: Sequelize.TEXT,
			groupCampaign: Sequelize.BOOLEAN,
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
		return queryInterface.dropTable('Campaigns');
	},
};