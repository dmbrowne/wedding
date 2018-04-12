import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('CampaignAttendeeGroups', {
			campaignId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			sendGroupId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
		});
		await queryInterface.addConstraint('CampaignAttendeeGroups', ['campaignId', 'sendGroupId'], {
			type: 'unique',
			name: 'unique_campaign_attendeeGroup',
		});
		await queryInterface.addConstraint('CampaignAttendeeGroups', ['campaignId'], {
			name: 'campaign_attendee_group_campaignId_fk',
			type: 'foreign key',
			onDelete: 'CASCADE',
			references: {
				table: 'Campaigns',
				field: 'id',
			},
		});
		await queryInterface.addConstraint('CampaignAttendeeGroups', ['sendGroupId'], {
			name: 'campaign_attendee_group_sendGroupId_fk',
			type: 'foreign key',
			onDelete: 'CASCADE',
			references: {
				table: 'SendingGroups',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('CampaignAttendeeGroups', 'campaign_attendee_group_sendGroupId_fk');
		await queryInterface.removeConstraint('CampaignAttendeeGroups', 'campaign_attendee_group_campaignId_fk');
		await queryInterface.removeConstraint('CampaignAttendeeGroups', 'unique_campaign_attendeeGroup');
	},
};
