import { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addConstraint('attendees', ['tableId'], {
			type: 'foreign key',
			name: 'attendee_table_fk',
			references: {
				table: 'seatingTables',
				field: 'id',
			},
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeConstraint('attendees', 'attendee_table_fk');
	},
};
