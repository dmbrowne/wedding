import { Router, Response, NextFunction } from 'express';
import {
	login,
	signIn,
	getSessionUser,
	updateAccount,
	changeUserPassword,
} from '../controllers/userController';
import { NextAppRequest } from '../types';
import { verifyUser, xhrOnly } from '../utils/express';

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
	.route('/me')
	.get([verifyUser, getSessionUser], getSessionUser)
	.put([verifyUser, getSessionUser], updateAccount);

router.put('/me/password', [verifyUser, getSessionUser], changeUserPassword);

export default router;
