import { Router, Response, NextFunction } from 'express';
import {
	login,
	signIn,
	getSessionUser,
	updateAccount,
	changeUserPassword,
	logout,
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

router.get('/', (req, res) => res.redirect('/invitation'));

router
	.route('/login')
	.get(dashboardRedirect, signIn)
	.post(login);

router.post('/logout', verifyUser, logout);

router
	.route('/me')
	.get([verifyUser, xhrOnly], getSessionUser)
	.put([verifyUser, xhrOnly], updateAccount);

router.put('/me/password', [verifyUser, xhrOnly], changeUserPassword);

export default router;
