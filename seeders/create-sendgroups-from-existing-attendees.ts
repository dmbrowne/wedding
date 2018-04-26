import models from '../app/server/models';
import * as fs from 'fs';
import * as path from 'path';
import Attendee from '../app/server/models/attendee';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const emails = [
	'daryl.browne@hotmail.com',
	'yasminobosi@yahoo.co.uk',
];

const gmailEmail = (id) => {
	return getRandomArbitrary(0, 1) ? `daryl.browne+${id}@gmail.com` : `yasmin.obosi+${id}@gmail.com`;
};

module.exports = {
	up: () => {
		return models.Attendee.findAll()
			.then((attendees: Attendee[]) => {
				const sendGroups = [];
				for (let i = 0; i < 15; i++) {
					const numberOfMembers = getRandomArbitrary(2, 3);
					const randomUser1 = attendees.splice(getRandomInt(attendees.length - 1), 1)[0];
					const randomUser2 = attendees.splice(getRandomInt(attendees.length - 1), 1)[0];
					const randomUser3 = numberOfMembers === 3 ?
							attendees.splice(getRandomInt(attendees.length - 1), 1)[0] :
							null;
					const members = [randomUser1, randomUser2, randomUser3].filter(user => !user);
					const name = members.map(user => user.firstName).join(', ');

					sendGroups.push({
						name,
						email: getRandomArbitrary(0, 1) ? gmailEmail(i) : emails[getRandomArbitrary(0, emails.length - 1)],
						attendeeIds: members.map(attendee => attendee.id),
					});
				}
				fs.writeFileSync(path.join(__dirname, './seededSendGroups.json'), JSON.stringify({
					sendGroups,
				}));
				return models.SendGroup.bulkCreate(sendGroups);
			});
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
