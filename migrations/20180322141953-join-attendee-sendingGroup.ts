import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		queryInterface.addColumn('attendees', 'sendingGroupId', {
			type: Sequelize.UUID,
		});
		queryInterface.addConstraint('attendees', ['sendingGroupId'], {
			type: 'foreign key',
			name: 'attendee_sendingGroup_fk',
			references: {
				table: 'sendingGroups',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		queryInterface.removeConstraint('attendees', 'attendee_sendingGroup_fk');
		queryInterface.removeColumn('attendees', 'sendingGroupId');
	},
};
