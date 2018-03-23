import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addColumn('Attendees', 'sendGroupId', {
			type: Sequelize.UUID,
		});
		await queryInterface.addConstraint('Attendees', ['sendGroupId'], {
			type: 'foreign key',
			name: 'attendee_sendGroup_fk',
			references: {
				table: 'SendingGroups',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('Attendees', 'attendee_sendGroup_fk');
		await queryInterface.removeColumn('Attendees', 'sendGroupId');
	},
};
