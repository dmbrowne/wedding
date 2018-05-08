import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('CampaignAttendees', 'campaign_attendee_campaignId_fk');
		await queryInterface.addConstraint('CampaignAttendees', ['campaignId'], {
			name: 'campaign_attendee_campaignId_fk',
			type: 'foreign key',
			onDelete: 'SET NULL',
			references: {
				table: 'Campaigns',
				field: 'id',
			},
		});
		await queryInterface.removeConstraint('CampaignAttendees', 'campaign_attendee_attendeeId_fk');
		await queryInterface.addConstraint('CampaignAttendees', ['attendeeId'], {
			name: 'campaign_attendee_attendeeId_fk',
			type: 'foreign key',
			onDelete: 'SET NULL',
			references: {
				table: 'Attendees',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('CampaignAttendees', 'campaign_attendee_attendeeId_fk');
		await queryInterface.removeConstraint('CampaignAttendees', 'campaign_attendee_campaignId_fk');
	},
};
