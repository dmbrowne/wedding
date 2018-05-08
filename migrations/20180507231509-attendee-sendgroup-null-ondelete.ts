import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addConstraint('Attendees', ['sendGroupId'], {
			type: 'foreign key',
			name: 'attendee_sendGroup_fk',
			onDelete: 'SET NULL',
			references: {
				table: 'SendGroups',
				field: 'id',
			},
		});
		.catch(e => {
			console.log(e);
			throw Error(e);
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('Attendees', 'attendee_sendGroup_fk');
		await queryInterface.addConstraint('Attendees', ['sendGroupId'], {
			type: 'foreign key',
			name: 'attendee_sendGroup_fk',
			onDelete: 'CASCADE',
			references: {
				table: 'SendGroups',
				field: 'id',
			},
		});
	},
};
