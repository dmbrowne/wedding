import { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'next';
import { register, login } from '../controllers/user';

const router = Router();

const consoleRedirect = (req: Request, res: Response, next: NextFunction) => {
	if (req.session && req.session.user) {
		return res.redirect('/console');
	}
	next();
};

router.get('/register', (req, res) => req.nextAppRenderer.render(req, res, '/signup'));
router.get('/login', consoleRedirect, (req, res) =>  req.nextAppRenderer.render(req, res, '/login'));

router.post('/users', register);
router.post('/login', login);

export default router;
