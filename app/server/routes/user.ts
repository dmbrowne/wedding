import { Router, Response, NextFunction } from 'express';
import { login, signIn } from '../controllers/user';
import { NextAppRequest } from '../types';
import { verifyUser } from '../utils/express';

const router = Router();

const dashboardRedirect = (req: NextAppRequest, res: Response, next: NextFunction) => {
	// if (req.session && req.session.user) {
	// 	return res.redirect('/dashboard');
	// }
	next();
};

router
	.route('/login')
	.get(dashboardRedirect, signIn)
	.post(login);

router
	.route('/')
	.get(verifyUser, (req: NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/dashboard'));

export default router;
