import { Request, Response, NextFunction } from 'express';
import models from '../models';

export function register(req: Request, res: Response, next: NextFunction) {
	if (req.session && req.session.signUpError) {
		delete req.session.signUpError;
	}

	const { email, password } = req.body;

	if (!email || !password) {
		req.session.signUpError = 'Email and password is required when creating a new user';
		return res.redirect('/sign-up');
	}

	models.User
		.findOrCreate({
			where: { email },
			defaults: { password },
		})
		.then(([user, created]) => {
			if (!created) {
				req.session.signUpError = `User with the email address ${email} already exists`;
				return res.redirect('/sign-up');
			}
			req.session.user = user;
			res.redirect('/console');
		})
		.catch(err => {
			next(err);
		});
}

export function login(req: Request, res: Response, next) {
	if (req.session && req.session.loginError) {
		delete req.session.loginError;
	}

	const { email, password } = req.body;

	if (!email || !password) {
		req.session.loginError = 'Email and password is required to log in';
		return res.redirect('/admin/login');
	}

	models.User.findOne({
		where: { email },
	})
	.then((user) => {
		if (!user) {
			req.session.loginError = 'An account with the given email address does not exist.';
			return res.redirect('/admin/login');
		}
		user.checkPassword(password).then(correctPassword => {
			if (!correctPassword) {
				req.session.loginError = `The given password mismatches the one stored for ${email}.`;
				return res.redirect('/admin/login');
			}
			req.session.user = user;
			res.redirect('/admin');
		});
	})
	.catch(err => {
		next(err);
	});
}
