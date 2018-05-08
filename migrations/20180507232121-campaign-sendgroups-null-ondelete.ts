import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('CampaignSendGroups', 'campaign_attendee_group_campaignId_fk');
		await queryInterface.addConstraint('CampaignSendGroups', ['campaignId'], {
			name: 'campaign_attendee_group_campaignId_fk',
			type: 'foreign key',
			onDelete: 'SET NULL',
			references: {
				table: 'Campaigns',
				field: 'id',
			},
		});
		await queryInterface.removeConstraint('CampaignSendGroups', 'campaign_attendee_group_sendGroupId_fk');
		await queryInterface.addConstraint('CampaignSendGroups', ['sendGroupId'], {
			name: 'campaign_attendee_group_sendGroupId_fk',
			type: 'foreign key',
			onDelete: 'SET NULL',
			references: {
				table: 'SendGroups',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('CampaignSendGroups', 'campaign_attendee_group_campaignId_fk');
		await queryInterface.addConstraint('CampaignSendGroups', ['campaignId'], {
			name: 'campaign_attendee_group_campaignId_fk',
			type: 'foreign key',
			onDelete: 'CASCADE',
			references: {
				table: 'Campaigns',
				field: 'id',
			},
		});
		await queryInterface.removeConstraint('CampaignSendGroups', 'campaign_attendee_group_sendGroupId_fk');
		await queryInterface.addConstraint('CampaignSendGroups', ['sendGroupId'], {
			name: 'campaign_attendee_group_sendGroupId_fk',
			type: 'foreign key',
			onDelete: 'CASCADE',
			references: {
				table: 'SendGroups',
				field: 'id',
			},
		});
	},
};
