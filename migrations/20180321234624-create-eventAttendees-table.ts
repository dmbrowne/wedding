import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('eventAttendees', {
			eventId: {
				allowNull: false,
				type: Sequelize.UUID,
			},
			attendeeId: {
				allowNull: false,
				type: Sequelize.UUID,
			},
			attending: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
			},
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('eventAttendees');
	},
};
