import Sequelize, {
	QueryInterface
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.renameTable('SendingGroups', 'SendGroups');
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.renameTable('SendGroups', 'SendingGroups');
	},
};
