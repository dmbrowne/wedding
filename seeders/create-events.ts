import { QueryInterface } from 'sequelize';
import models from '../app/server/models';
import * as faker from 'faker';

module.exports = {
	up: () => {
		const ceremonyDateEnty = new Date('September 12, 2018 16:30:00');
		const ceremonyDateStart = new Date('September 12, 2018 17:00:00');
		const ceremonyDateEnd = new Date('September 12, 2018 18:00:00');

		const breakfastDateStart = new Date('September 12, 2018 19:00:00');
		const breakfastDateEnd = new Date('September 12, 2018 21:00:00');

		const receptionDateStart = new Date('September 12, 2018 21:00:00');
		const receptionDateEnd = new Date('September 13, 2018 02:00:00');

		return models.Event.bulkCreate([{
			name: 'Ceremony',
			slug: 'ceremony',
			description: faker.lorem.paragraph(),
			entryTime: ceremonyDateEnty,
			startTime: ceremonyDateStart,
			endTime: ceremonyDateEnd,
			imageId: null,
			venueName: 'Town Hall',
			address: `${faker.address.streetName()}\n${faker.address.streetAddress()}\n${faker.address.zipCode()}\n`,
			mapsLink: 'https://goo.gl/maps/PVTYd9dHqzP2',
			dietFeedback: false,
		}, {
			name: 'Wedding Breakfast',
			slug: 'wedding-breakfast',
			description: faker.lorem.paragraph(),
			entryTime: null,
			startTime: breakfastDateStart,
			endTime: breakfastDateEnd,
			imageId: null,
			venueName: 'Vanilla London',
			address: `${faker.address.streetName()}\n${faker.address.streetAddress()}\n${faker.address.zipCode()}\n`,
			mapsLink: 'https://goo.gl/maps/PVTYd9dHqzP2',
			dietFeedback: true,
		}, {
			name: 'Reception',
			slug: 'reception',
			description: faker.lorem.paragraph(),
			entryTime: null,
			startTime: receptionDateStart,
			endTime: receptionDateEnd,
			imageId: null,
			venueName: 'Vanilla London',
			address: `${faker.address.streetName()}\n${faker.address.streetAddress()}\n${faker.address.zipCode()}\n`,
			mapsLink: 'https://goo.gl/maps/PVTYd9dHqzP2',
			dietFeedback: false,
		}]);
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.bulkDelete('Event', null, {});
	},
};
