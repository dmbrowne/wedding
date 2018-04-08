import { Router } from 'express';
import { getGroupInvitation, getSingleInvitation, rsvpConfirm } from '../controllers/attendeeController';

const router = Router();

router.get('/g/:sendGroupId', getGroupInvitation);
router.get('/a/:attendeeId', getSingleInvitation);
router.post('/rsvp/:invitationId', rsvpConfirm);

export default router;
