import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addColumn('Attendees', 'sendingGroupId', {
			type: Sequelize.UUID,
		});
		await queryInterface.addConstraint('Attendees', ['sendingGroupId'], {
			type: 'foreign key',
			name: 'attendee_sendingGroup_fk',
			references: {
				table: 'SendingGroups',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('Attendees', 'attendee_sendingGroup_fk');
		await queryInterface.removeColumn('Attendees', 'sendingGroupId');
	},
};
