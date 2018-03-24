import { Router } from 'express';
import {
	createEvent,
	getAllEvents,
	getEvent,
	editEvent,
	deleteEvent,
	addAttendeesToEvent,
	removeAttendeesFromEvent,
} from '../controllers/eventsController';
import { NextAppRequest } from '../types';
import { verifyUser } from '../utils/express';

const router = Router();

// router.use(verifyUser);

router.route('/')
	.get(getAllEvents)
	.post(createEvent);

router.get('/new', (req: NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/eventCreate'));

router.route('/:eventId')
	.get(getEvent)
	.put(editEvent)
	.delete(deleteEvent);

router.route('/:eventId/attendees')
	.post(addAttendeesToEvent)
	.delete(removeAttendeesFromEvent);

export default router;
