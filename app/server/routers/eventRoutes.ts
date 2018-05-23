import { Router } from 'express';
import {
	createEvent,
	getAllEvents,
	getEvent,
	editEvent,
	deleteEvent,
	setEventAttendees,
	addEventGuest,
	getEventAttendees,
} from '../controllers/eventsController';
import { NextAppRequest } from '../types';
import { verifyUser } from '../utils/express';
import Attendee from '../models/attendee';
import FoodChoice from '../models/foodChoice';

const router = Router();

router.use(verifyUser);

router.route('/')
	.get(getAllEvents)
	.post(createEvent);

router.get('/new', (req: NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/eventCreate'));

router.route('/:eventId')
	.get(getEvent)
	.put(editEvent)
	.delete(deleteEvent);

router.route('/:eventId/attendees')
	.get(getEventAttendees)
	.put(addEventGuest)
	.post(setEventAttendees);

router.route('/:eventId/foodchoices')
	.get((req, res) => {
		Attendee.findAll({
			order: [['firstName', 'ASC']],
			where: { eventId: req.params.eventId },
			include: [{ model: FoodChoice }],
		})
		.then(attendees => {
			//
		});
	});

export default router;
