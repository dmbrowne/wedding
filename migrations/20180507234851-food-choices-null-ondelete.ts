import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('FoodChoices', 'attendee_foodchoice_fk');
		await queryInterface.addConstraint('FoodChoices', ['attendeeId'], {
			type: 'foreign key',
			name: 'attendee_foodchoice_fk',
			onDelete: 'SET NULL',
			references: {
				table: 'Attendees',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('FoodChoices', 'attendee_foodchoice_fk');
		await queryInterface.addConstraint('FoodChoices', ['attendeeId'], {
			type: 'foreign key',
			name: 'attendee_foodchoice_fk',
			onDelete: 'CASCADE',
			references: {
				table: 'Attendees',
				field: 'id',
			},
		});
	},
};
