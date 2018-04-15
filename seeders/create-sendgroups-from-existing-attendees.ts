import models from '../app/server/models';
import * as faker from 'faker';
// import * as fs from 'fs';
import * as path from 'path';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
	up: () => {
		return models.Attendee.findAll({ raw: true })
			.then(attendees => {
				const sendGroups = [];
				for (let i = 0; i < 15; i++) {
					const randomNum1 = getRandomInt(attendees.length - 1);
					const randomUser1 = attendees.splice(randomNum1, 1);
					const randomNum2 = getRandomInt(attendees.length - 1);
					const randomUser2 = attendees.splice(randomNum2, 1);
					sendGroups.push({
						name: faker.random.word(),
						email: faker.internet.email(),
						attendeeIds: [randomUser1.id, randomUser2.id],
					});
				}
				return models.SendGroup.bulkCreate(sendGroups);
			});
	},

	down: () => {
		// const seededSendGroups = require(path.join(__dirname, './seededSendGroups.json'));
		// const sendGroupdIds = seededSendGroups.sendGroups.map(sendGroup => sendGroup.id);
		// return models.SendGroup.destroy({
		// 	where: {
		// 		id: sendGroupdIds,
		// 	},
		// });
	},
};
