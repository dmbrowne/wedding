import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('SendingGroups', 'email', { type: Sequelize.STRING });
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('SendingGroups', 'email');
	},
};
