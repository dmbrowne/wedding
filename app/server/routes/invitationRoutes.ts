import { Router } from 'express';
import { getGroupInvitation, getSingleInvitation } from '../controllers/attendeeController';

const router = Router();

router.get('/g/:sendGroupId', getGroupInvitation);
router.get('/a/:attendeeId', getSingleInvitation);

export default router;
