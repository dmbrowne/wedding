import models from '../app/server/models';
import * as faker from 'faker';
import * as fs from 'fs';
import * as path from 'path';

module.exports = {
	up: () => {
		const fakeUsers = [];
		for (let i = 0; i < 50; i++) {
			fakeUsers.push({
				email: faker.internet.email(),
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
			});
		}

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

	down: () => {
		return true;
	},
};
