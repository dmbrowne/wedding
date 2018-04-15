import models from '../app/server/models';
import * as faker from 'faker';
import * as fs from 'fs';
import * as path from 'path';
import attendees from './seededUsers.json';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
	up: () => {
		const fakeUsers = attendees.fakeUsers;
		const sendGroups = [];
		for (let i = 0; i < 15; i++) {
			const randomNum1 = getRandomInt(fakeUsers.length - 1);
			const randomUser1 = fakeUsers.splice(randomNum1, 1);
			const randomNum2 = getRandomInt(fakeUsers.length - 1);
			const randomUser2 = fakeUsers.splice(randomNum2, 1);
			sendGroups.push({
				name: faker.random.word,
				email: faker.internet.email(),
				attendeeIds: [randomUser1.id, randomUser2.id],
			});
		}
		fs.writeFileSync(path.join(__dirname, './seededSendGroups.json'), JSON.stringify({
			sendGroups,
		}));

		return models.SendGroup.bulkCreate(sendGroups);
	},

	down: () => {
		const seededSendGroups = require(path.join(__dirname, './seededSendGroups.json'));
		const sendGroupdIds = seededSendGroups.sendGroups.map(sendGroup => sendGroup.id);
		return models.SendGroup.destroy({
			where: {
				id: sendGroupdIds,
			},
		});
	},
};
