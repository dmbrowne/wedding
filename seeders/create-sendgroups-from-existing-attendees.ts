import models from '../app/server/models';
import * as fs from 'fs';
import * as path from 'path';
import Attendee from '../app/server/models/attendee';
import { getRandomInt, getRandomArbitrary } from '../app/server/utils';

const emails = [
	'daryl.browne@hotmail.com',
	'yasminobosi@yahoo.co.uk',
];

const gmailEmail = (id) => {
	return getRandomArbitrary(0, 2) ? `daryl.browne+${id}@gmail.com` : `yasmin.obosi+${id}@gmail.com`;
};

module.exports = {
	up: () => {
		return models.Attendee.findAll()
			.then((attendees: Attendee[]) => {
				const sendGroups = [];
				for (let i = 0; i < 15; i++) {
					const numberOfMembers = getRandomArbitrary(2, 4);
					const randomUser1 = attendees.splice(getRandomInt(attendees.length - 1), 1)[0];
					const randomUser2 = attendees.splice(getRandomInt(attendees.length - 1), 1)[0];
					const randomUser3 = numberOfMembers === 3 ? attendees.splice(getRandomInt(attendees.length - 1), 1)[0] : null;

					const members = [randomUser1, randomUser2, randomUser3].filter(user => !!user);
					const name = members.map(user => user.getDataValue('firstName')).join(', ');
					const attendeeIds = members.map(attendee => attendee.getDataValue('id'));

					sendGroups.push({
						name,
						email: getRandomArbitrary(0, 2) ? gmailEmail(i) : emails[getRandomArbitrary(0, emails.length)],
						attendeeIds,
					});
				}

				return Promise.all(sendGroups.map(sendGroup => {
					return models.SendGroup.create(sendGroup).then(group => group.setAttendees(sendGroup.attendeeIds));
				}));
			});
	},

	down: () => {
		return true;
	},
};
