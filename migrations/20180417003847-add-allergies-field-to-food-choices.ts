import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.addColumn('FoodChoices', 'allergies', Sequelize.TEXT);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.removeColumn('FoodChoices', 'allergies');
	},
};
