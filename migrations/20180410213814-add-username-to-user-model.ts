import Sequelize, {
	QueryInterface
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('Users', 'username', {
			type: Sequelize.STRING,
			unique: true,
		})
		.then(() => queryInterface.changeColumn('Users', 'email', {
			type: Sequelize.STRING,
			allowNull: true,
		}));
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('Users', 'username')
			.then(() => queryInterface.changeColumn('Users', 'email', {
				type: Sequelize.STRING,
				allowNull: false,
			}));
	},
};
