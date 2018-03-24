import { Router } from 'express';
import {
	getAllAttendees,
	getAttendee,
	createNewAttendees,
	editAttendee,
	deleteAttendee,
} from '../controllers/attendeeController';
import { NextAppRequest } from '../types';
import { verifyUser } from '../utils/express';

const router = Router();

// router.use(verifyUser);

router.route('/')
	.get(getAllAttendees)
	.post(createNewAttendees)
	.delete(deleteAttendee);

router.get('/new', (req: NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/attendeeCreate'));

router.route('/:attendeeId')
	.get(getAttendee)
	.put(editAttendee)
	.delete(deleteAttendee);

export default router;
