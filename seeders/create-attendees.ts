import { QueryInterface } from 'sequelize';
import models from '../app/server/models';

module.exports = {
	up: () => {
		return models.Attendee.bulkCreate([
			{
				email: null,
				firstName: 'Jane',
				lastName: 'Doe',
			},
			{
				email: 'sralph@test.com',
				firstName: 'Sally',
				lastName: 'Ralph',
			},
			{
				email: 'dd@test.com',
				firstName: 'Danny',
				lastName: 'Dyer',
			},
			{
				email: 'john@test.com',
				firstName: 'John',
				lastName: 'Doe',
			},
		]);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.bulkDelete('Attendees', null, {});
	},
};
