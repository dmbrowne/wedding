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
			content: Sequelize.TEXT,
			groupCampaign: Sequelize.BOOLEAN,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.dropTable('Campaigns');
	},
};