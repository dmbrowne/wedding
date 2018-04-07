import { QueryInterface } from 'sequelize';
import models from '../app/server/models';

module.exports = {
	up: () => {
		return models.User.bulkCreate([{
			email: 'daryl.browne@gmail.com',
			password: 'admin',
			firstName: 'Daryl',
			lastName: 'Browne',
			role: 'admin',
		}]);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.bulkDelete('Users', null, {});
	},
};
