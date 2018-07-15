import { Router, Request } from 'express';
import {
	getAllAttendees,
	getNonGroupedAttendees,
	createNewAttendees,
	editAttendee,
	deleteAttendee,
	updateAttendeeEventAttendance,
	updateFoodChoice,
} from '../controllers/attendeeController';
import { verifyUser } from '../utils/express';
import Attendee from '../models/attendee';
import Event from '../models/event';

declare module "express" {
	interface Request {
		attendee: Attendee;
	}
}

const router = Router();

router.use(verifyUser);

router.route('/')
	.get(getAllAttendees)
	.post(createNewAttendees)
	.delete(deleteAttendee);

router.get('/nongrouped', getNonGroupedAttendees);

router.get('/new', (req: Request, res) => req.nextAppRenderer.render(req, res, '/attendeeCreate'));


router.route('/:attendeeId')
	.all(async (req: Request, res, next) => {
		const attendee = await Attendee.getAttendeeWtihInvitedEvents(req.params.attendeeId);
		if (!attendee) {
			res.status(400);
			throw Error(`Attendee not found with the id ${req.params.attendeeId}`);
		}
		req.attendee = attendee;
		next();
	})
	.get((req: Request, res, next) => {
		if (req.xhr) {
			res.send(req.attendee);
		}
		return next();
	})
	.get(async (req: Request, res) => {
		res.locals.attendee = req.attendee;
		res.locals.allEvents = await Event.findAll();
		req.nextAppRenderer.render(req, res, '/attendeeEdit');
	})
	.put(editAttendee)
	.delete(deleteAttendee);

router.put('/:attendeeId/attendance', updateAttendeeEventAttendance);
router.put('/:attendeeId/foodchoices', updateFoodChoice);

export default router;
