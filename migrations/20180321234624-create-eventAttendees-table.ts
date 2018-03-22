import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('EventAttendees', {
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
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('EventAttendees');
	},
};
