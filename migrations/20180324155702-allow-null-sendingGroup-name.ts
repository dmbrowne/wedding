import Sequelize, {
	QueryInterface,
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.changeColumn('SendingGroups', 'name', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.changeColumn('SendingGroups', 'name', {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},
};
