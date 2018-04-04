import { Request, Response, NextFunction } from 'express';
import { NextAppRequest } from '../types';
import models from '../models';
import { getDesiredValuesFromRequestBody } from '../utils';

const loginErrorCatalogue = (code) => {
	switch (code) {
		case 404:
			return 'An account with the given email address does not exist.';
		case 401:
			return 'The given password mismatches the one stored for the email entered';
		default:
			return 'Sorry, there was an error with your log in';
	}
};

export function signIn(req: NextAppRequest, res) {
	const { error } = req.query;

	if (error) {
		res.locals.errorMessage = loginErrorCatalogue(error);
	}

	req.nextAppRenderer.render(req, res, '/login');
}

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
	const { email, password } = req.body;

	if (!email || !password) {
		req.session.loginError = 'Email and password is required to log in';
		return res.redirect('/login');
	}

	const UserWithPassword = models.User.scope('allFields');

	UserWithPassword.findOne({
		where: { email },
	})
	.then(user => {
		if (!user) {
			return res.redirect('/login?error=404');
		}

		user.checkPassword(password).then(correctPassword => {
			if (!correctPassword) {
				req.session.loginError = `The given password mismatches the one stored for ${email}.`;
				return res.redirect('/login?error=401');
			}

			models.User.findById(user.id).then(safeUser => {
				delete req.session.loginError;
				req.session.user = safeUser;
				res.redirect('/admin');
			});
		});
	})
	.catch(err => next(err));
}

export function getSessionUser(req: Request, res: Response) {
	res.send(req.session.user);
}

export function updateAccount(req: Request, res: Response, next: NextFunction) {
	const { user } = req.session;
	const { email, username } = req.body;
	if (!email && !username) {
		res.send(user);
	}

	const updateValues = getDesiredValuesFromRequestBody(['email', 'username'], req.body);
	models.User.findById(user.id)
		.then(usr => usr.update(updateValues))
		.then(updatedUser => {
			req.session.user = updatedUser;
			return res.send(updatedUser);
		})
		.catch(err => { console.log('fucking Error!!!', err); });
}

export async function changeUserPassword(req: Request, res: Response, next: NextFunction) {
	const { user: sessionUser } = req.session;
	const { currentPassword, newPassword } = req.body;
	const user = await models.User.findById(sessionUser.id);
	const currentPwCorrect = await user.checkPassword(currentPassword);

	if (!currentPwCorrect) {
		return res.status(400).send({ message: 'The current password given is incorrect' });
	}

	const updatedUser = await user.update({ password: newPassword });
	return res.send(updatedUser);
}
