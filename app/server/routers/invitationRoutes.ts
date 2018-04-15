import { Router } from 'express';
import { getGroupInvitation, getSingleInvitation, rsvpConfirm } from '../controllers/attendeeController';

const router = Router();

router.get('/g/:sendGroupId', getGroupInvitation);
router.get('/g/:sendGroupId/donate', (req, res) => req.nextAppRenderer.render(req, res, '/donate'));

router.get('/a/:attendeeId', getSingleInvitation);
router.get('/a/:attendeeId/donate', (req, res) => req.nextAppRenderer.render(req, res, '/donate'));

router.post('/rsvp/:invitationId', rsvpConfirm);

export default router;
