import { Router } from 'express';
import { getGroupInvitation, getSingleInvitation, singleInvitationRsvpConfirm, groupInvitationRsvpConfirm } from '../controllers/attendeeController';
import Attendee from '../models/attendee';
import SendGroup from '../models/sendGroup';

const router = Router();

router.get('/g/:sendGroupId', getGroupInvitation);
router.get('/g/:sendGroupId/donate', async (req, res) => {
	res.locals.sendGroup = SendGroup.findById(req.params.sendGroupId);
	req.nextAppRenderer.render(req, res, '/donate');
});
router.post('/g/:sendGroupId/rsvp', groupInvitationRsvpConfirm);

router.get('/a/:attendeeId', getSingleInvitation);
router.get('/a/:attendeeId/donate', async (req, res) => {
	res.locals.attendee = Attendee.findById(req.params.attendeeId);
	req.nextAppRenderer.render(req, res, '/donate');
});
router.post('/a/:attendeeId/rsvp', singleInvitationRsvpConfirm);

export default router;
