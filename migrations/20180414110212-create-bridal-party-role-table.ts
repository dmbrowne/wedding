import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('BridalPartyRoles', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: Sequelize.STRING,
			value: Sequelize.STRING,
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.dropTable('BridalPartyRoles');
	},
};