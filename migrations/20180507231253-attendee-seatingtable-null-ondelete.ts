import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('Attendees', 'attendee_table_fk');
		await queryInterface.addConstraint('Attendees', ['tableId'], {
			type: 'foreign key',
			name: 'attendee_table_fk',
			onDelete: 'SET NULL',
			references: {
				table: 'SeatingTables',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('Attendees', 'attendee_table_fk');
		await queryInterface.addConstraint('Attendees', ['tableId'], {
			type: 'foreign key',
			name: 'attendee_table_fk',
			onDelete: 'CASCADE',
			references: {
				table: 'SeatingTables',
				field: 'id',
			},
		});
	},
};
