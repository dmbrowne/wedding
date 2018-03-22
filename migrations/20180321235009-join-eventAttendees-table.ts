import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		queryInterface.addConstraint('eventAttendees', ['eventId', 'attendeeId'], {
			type: 'unique',
			name: 'unique_event_attendee',
		});
		queryInterface.addConstraint('eventAttendees', ['eventId'], {
			name: 'event_attendee_eventId_fk',
			type: 'foreign key',
			references: {
				table: 'events',
				field: 'id',
			},
		});
		queryInterface.addConstraint('eventAttendees', ['attendeeId'], {
			name: 'event_attendee_attendeeId_fk',
			type: 'foreign key',
			references: {
				table: 'attendees',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		queryInterface.removeConstraint('eventAttendees', 'unique_event_attendee');
		queryInterface.removeConstraint('eventAttendees', 'event_attendee_eventId_fk');
		queryInterface.removeConstraint('eventAttendees', 'event_attendee_attendeeId_fk');
	},
};
