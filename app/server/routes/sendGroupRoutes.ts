import { Router } from 'express';
import {
	getAllSendGroups,
	getSendGroup,
	createSendGroup,
	editSendGroup,
	deleteSendGroup,
	deleteMultipleSendGroups,
} from '../controllers/sendGroupController';
import { NextAppRequest } from '../types';
import { verifyUser, xhrOnly } from '../utils/express';

const router = Router();

// router.use(verifyUser);

router.route('/')
	.get(getAllSendGroups)
	.post(xhrOnly, createSendGroup)
	.delete(xhrOnly, deleteMultipleSendGroups);

router.get('/new', (req: NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/sendGroupCreate'));

router.route('/:sendGroupId')
	.get(getSendGroup)
	.put(xhrOnly, editSendGroup)
	.delete(xhrOnly, deleteSendGroup);

export default router;
