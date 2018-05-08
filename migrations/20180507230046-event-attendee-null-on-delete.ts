import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('EventAttendees', 'event_attendee_eventId_fk');
		await queryInterface.addConstraint('EventAttendees', ['eventId'], {
			name: 'event_attendee_eventId_fk',
			type: 'foreign key',
			onDelete: 'SET NULL',
			references: {
				onDelete: 'SET NULL',
				table: 'Events',
				field: 'id',
			},
		});
		await queryInterface.removeConstraint('EventAttendees', 'event_attendee_attendeeId_fk');
		await queryInterface.addConstraint('EventAttendees', ['attendeeId'], {
			name: 'event_attendee_attendeeId_fk',
			type: 'foreign key',
			onDelete: 'SET NULL',
			references: {
				table: 'Attendees',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('EventAttendees', 'event_attendee_eventId_fk');
		await queryInterface.addConstraint('EventAttendees', ['eventId'], {
			name: 'event_attendee_eventId_fk',
			type: 'foreign key',
			onDelete: 'CASCADE',
			references: {
				onDelete: 'CASCADE',
				table: 'Events',
				field: 'id',
			},
		});
		await queryInterface.removeConstraint('EventAttendees', 'event_attendee_attendeeId_fk');
		await queryInterface.addConstraint('EventAttendees', ['attendeeId'], {
			name: 'event_attendee_attendeeId_fk',
			type: 'foreign key',
			onDelete: 'CASCADE',
			references: {
				table: 'Attendees',
				field: 'id',
			},
		});
	},
};
