import Sequelize, {
	QueryInterface
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.changeColumn('Events', 'description', Sequelize.TEXT);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.changeColumn('Events', 'description', Sequelize.STRING);
	},
};
