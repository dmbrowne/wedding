import Sequelize, {
	QueryInterface
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.renameTable('CampaignAttendeeGroups', 'CampaignSendGroups');
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.renameTable('CampaignSendGroups', 'CampaignAttendeeGroups');
	},
};
