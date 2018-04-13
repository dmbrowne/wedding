import { QueryInterface } from 'sequelize';
import models from '../app/server/models';
import * as faker from 'faker';
import * as fs from 'fs';
import * as path from 'path';

module.exports = {
	up: () => {
		const fakeUsers = [];
		for (let i = 0; i < 30; i++) {
			fakeUsers.push({
				email: Math.round(Math.random()) ? faker.internet.email() : null,
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
			});
		}

		fs.writeFileSync(path.join(__dirname, './seededUsers.json'), JSON.stringify({
			fakeUsers,
		}));

		return models.Attendee.bulkCreate([
			{
				email: 'daryl.browne@gmail.com',
				firstName: 'Darly',
				lastName: 'Browney',
			},
			{
				email: 'yasminobosi@yahoo.com',
				firstName: 'Yazzy',
				lastName: 'Bee',
			},
			...fakeUsers,
		]);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.bulkDelete('Attendees', null, {});
	},
};
