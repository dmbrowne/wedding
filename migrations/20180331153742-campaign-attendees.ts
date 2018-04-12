import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('CampaignAttendees', {
			campaignId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			attendeeId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
		});
		await queryInterface.addConstraint('CampaignAttendees', ['campaignId', 'attendeeId'], {
			type: 'unique',
			name: 'unique_campaign_attendee',
		});
		await queryInterface.addConstraint('CampaignAttendees', ['campaignId'], {
			name: 'campaign_attendee_campaignId_fk',
			type: 'foreign key',
			references: {
				table: 'Campaigns',
				field: 'id',
			},
		});
		await queryInterface.addConstraint('CampaignAttendees', ['attendeeId'], {
			name: 'campaign_attendee_attendeeId_fk',
			type: 'foreign key',
			references: {
				table: 'Attendees',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('CampaignAttendees', 'campaign_attendee_attendeeId_fk');
		await queryInterface.removeConstraint('CampaignAttendees', 'campaign_attendee_campaignId_fk');
		await queryInterface.removeConstraint('CampaignAttendees', 'unique_campaign_attendee');
	},
};
