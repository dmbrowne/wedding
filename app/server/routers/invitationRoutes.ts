import { Router } from 'express';
import { getGroupInvitation, getSingleInvitation, singleInvitationRsvpConfirm, groupInvitationRsvpConfirm } from '../controllers/attendeeController';
import Attendee from '../models/attendee';
import SendGroup from '../models/sendGroup';

const router = Router();

router.route('/')
	.get((req, res) => {
		const { emailNotRecognised } = req.query;
		req.nextAppRenderer.render(req, res, '/getInvitation', emailNotRecognised ? { emailNotRecognised } : {});
	})
	.post((req, res) => {
		const { email } = req.body;
		if (!email) {
			return res.redirect('/invitation');
		}
		Attendee
			.findOne({ where: { email }})
			.then(async attendee => {
				const redirectLink = !attendee ? `/invitation?emailNotRecognised=${email}` : await attendee.getInviteLink();
				res.redirect(redirectLink);
			});
	});
router.get('/g/:sendGroupId', getGroupInvitation);
router.get('/g/:sendGroupId/donate', async (req, res) => {
	res.locals.sendGroup = await SendGroup.findById(req.params.sendGroupId);
	req.nextAppRenderer.render(req, res, '/donate');
});
router.post('/g/:sendGroupId/rsvp', groupInvitationRsvpConfirm);

router.get('/a/:attendeeId', getSingleInvitation);
router.get('/a/:attendeeId/donate', async (req, res) => {
	res.locals.attendee = await Attendee.findById(req.params.attendeeId);
	req.nextAppRenderer.render(req, res, '/donate');
});
router.post('/a/:attendeeId/rsvp', singleInvitationRsvpConfirm);

export default router;
