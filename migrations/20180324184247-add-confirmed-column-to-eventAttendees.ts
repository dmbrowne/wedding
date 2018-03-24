import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('EventAttendees', 'confirmed', {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('EventAttendees', 'confirmed');
	},
};
