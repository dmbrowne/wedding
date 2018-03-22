import { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'next';
import { register, login } from '../controllers/user';

interface NextAppRequest extends Request {
	nextAppRenderer: Server;
}

const router = Router();

const dashboardRedirect = (req: Request, res: Response, next: NextFunction) => {
	// if (req.session && req.session.user) {
	// 	return res.redirect('/console');
	// }
	next();
};

router.get('/register', (req: Request & NextAppRequest, res) => req.nextAppRenderer.render(req, res, '/signup'));
router.get('/login', dashboardRedirect, (req: NextAppRequest, res) =>  req.nextAppRenderer.render(req, res, '/login'));

router.post('/users', register);
router.post('/login', login);

export default router;
