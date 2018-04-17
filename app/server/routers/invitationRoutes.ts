import { Router } from 'express';
import { getGroupInvitation, getSingleInvitation, singleInvitationRsvpConfirm, groupInvitationRsvpConfirm } from '../controllers/attendeeController';

const router = Router();

router.get('/g/:sendGroupId', getGroupInvitation);
router.get('/g/:sendGroupId/donate', (req, res) => req.nextAppRenderer.render(req, res, '/donate'));
router.post('/g/:sendGroupId/rsvp', groupInvitationRsvpConfirm);

router.get('/a/:attendeeId', getSingleInvitation);
router.get('/a/:attendeeId/donate', (req, res) => req.nextAppRenderer.render(req, res, '/donate'));
router.post('/a/:attendeeId/rsvp', singleInvitationRsvpConfirm);

export default router;
