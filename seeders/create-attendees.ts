import models from '../app/server/models';
import * as faker from 'faker';
import * as fs from 'fs';
import * as path from 'path';
import { getRandomArbitrary } from '../app/server/utils';

const emails = [
	'daryl.browne@hotmail.com',
	'yasminobosi@yahoo.co.uk',
];

const gmailEmail = (id) => {
	return getRandomArbitrary(0, 1) ? `daryl.browne+${id}@gmail.com` : `yasmin.obosi+${id}@gmail.com`;
};

module.exports = {
	up: () => {
		const fakeUsers = [];
		for (let i = 0; i < 50; i++) {
			fakeUsers.push({
				email: getRandomArbitrary(0, 1) ? emails[getRandomArbitrary(0, emails.length - 1)] : gmailEmail(i),
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

	down: () => {
		const seededUsers = require(path.join(__dirname, './seededUsers.json'));
		const userIds = seededUsers.fakeUsers.map(user => user.id);
		return models.Attendee.destroy({
			where: {
				id: userIds,
			},
		});
	},
};
