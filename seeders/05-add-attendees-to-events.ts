import { QueryInterface } from 'sequelize';
import models from '../app/server/models';
import { getRandomInt } from '../app/server/utils';

module.exports = {
	up: async () => {
		const [events, attendees] = await Promise.all([
			models.Event.findAll(),
			models.Attendee.findAll(),
		]);

		if (!events || events.length === 0) {
			throw Error('There are no events available in the database');
		}

		return Promise.all(attendees.map(attendeeDAO => {
			const eventsIdsToAddToAttendee = events.filter(() => !!getRandomInt(2)).map(({ id }) => id);
			return attendeeDAO.setEvents(eventsIdsToAddToAttendee);
		}))
		.catch(e => console.error(e));
	},

	down: (queryInterface: QueryInterface) => {
		return true;
	},
};
