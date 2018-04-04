import { Router, Response, NextFunction } from 'express';
import {
	login,
	signIn,
	getSessionUser,
	updateAccount,
	changeUserPassword,
} from '../controllers/userController';
import { NextAppRequest } from '../types';

const router = Router();

const dashboardRedirect = (req: NextAppRequest, res: Response, next: NextFunction) => {
	if (req.xhr) {
		return next();
	}

	if (req.session && req.session.user) {
		return res.redirect('/admin');
	}

	next();
};

router
	.route('/login')
	.get(dashboardRedirect, signIn)
	.post(login);

router
	.route('/')
	.get((req: NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/dashboard'));

router
	.route('/me')
	.get(getSessionUser)
	.put(updateAccount);

router.put('/me/password', changeUserPassword);

export default router;
