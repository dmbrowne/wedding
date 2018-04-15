import { QueryInterface } from 'sequelize';
import models from '../app/server/models';

module.exports = {
	up: () => {
		return models.User.bulkCreate([{
			username: 'dbrowne',
			password: 'admin',
			firstName: 'Daryl',
			lastName: 'Browne',
			role: 'admin',
		}, {
			username: 'yazzybee',
			password: 'yazzyqueenbee',
			firstName: 'Yasmin',
			lastName: 'Obosi',
			role: 'admin',
		}]);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.bulkDelete('Users', null, {});
	},
};
