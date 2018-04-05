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

export function logout(req: Request, res: Response) {
	delete req.session.user;
	res.redirect('/login');
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

export function allUsers(req: NextAppRequest, res: Response) {
	models.User.findAll().then(users => {
		if (req.xhr) {
			return res.send(users);
		}
		res.locals.users = users;
		req.nextAppRenderer.render(req, res, '/users');
	});
}

export function getUser(req: NextAppRequest, res: Response) {
	const { userId } = req.params;
	return models.User.findById(userId).then(user => {
		if (req.xhr) {
			return res.send(user);
		}
		res.locals.user = user;
		req.nextAppRenderer.render(req, res, '/userEdit');
	});
}

export function createNewUser(req: Request, res: Response, next: NextFunction) {
	const { email, password, role, firstName, lastName } = req.body;
	models.User.create({
		email, password, role, firstName, lastName,
	})
	.then(user => {
		if (req.xhr) {
			return res.send(user);
		}
		res.redirect('/admin/users');
	})
	.catch(error => next(error));
}

export function editOtherUser(req: Request, res: Response, next: NextFunction) {
	if (req.session.user.role !== 'admin') {
		res.status(403);
		const errMessage = 'User does not have permission to edit this user';
		if (req.xhr) {
			return res.send({ message: errMessage });
		}
		next(new Error(errMessage));
	}

	const { userId } = req.params;
	const updateValues = getDesiredValuesFromRequestBody(
		['email', 'password', 'role', 'firstName', 'lastName'],
		req.body,
	);
	return models.User.findById(userId).then(user => {
		user.update(updateValues).then(updatedUser => {
			if (req.xhr) {
				return res.send(updatedUser);
			}
			res.redirect('/admin/users');
		});
	});
}

export function deleteUser(req: Request, res: Response, next: NextFunction) {
	if (req.session.user.role !== 'admin') {
		return res.status(403).send({ message: 'User does not have permission to edit this user' });
	}
	const { userId } = req.params;
	return models.User.findById(userId).then(user => {
		return user.destroy().then(() => res.send({ result: 'ok' }));
	});
}
