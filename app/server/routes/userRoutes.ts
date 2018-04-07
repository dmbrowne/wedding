import { Router } from 'express';
import {
	allUsers,
	getUser,
	createNewUser,
	deleteUser,
	editOtherUser,
} from '../controllers/userController';
import { xhrOnly, verifyUser } from '../utils/express';
import { NextAppRequest } from '../types';

const router = Router();

router.use(verifyUser);

router
	.route('/')
	.get(allUsers)
	.post(createNewUser);

router.get('/new', (req: NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/userCreate'));

router
	.route('/:userId')
	.get(getUser)
	.put(editOtherUser)
	.delete(xhrOnly, deleteUser);

export default router;
