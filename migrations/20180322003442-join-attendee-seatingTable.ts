import { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addConstraint('Attendees', ['tableId'], {
			type: 'foreign key',
			name: 'attendee_table_fk',
			references: {
				table: 'SeatingTables',
				field: 'id',
			},
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeConstraint('Attendees', 'attendee_table_fk');
	},
};
