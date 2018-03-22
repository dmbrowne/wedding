import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addConstraint('EventAttendees', ['eventId', 'attendeeId'], {
			type: 'unique',
			name: 'unique_event_attendee',
		});
		await queryInterface.addConstraint('EventAttendees', ['eventId'], {
			name: 'event_attendee_eventId_fk',
			type: 'foreign key',
			references: {
				table: 'Events',
				field: 'id',
			},
		});
		await queryInterface.addConstraint('EventAttendees', ['attendeeId'], {
			name: 'event_attendee_attendeeId_fk',
			type: 'foreign key',
			references: {
				table: 'Attendees',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('EventAttendees', 'unique_event_attendee');
		await queryInterface.removeConstraint('EventAttendees', 'event_attendee_eventId_fk');
		await queryInterface.removeConstraint('EventAttendees', 'event_attendee_attendeeId_fk');
	},
};
