import { Request, Response, NextFunction } from 'express';
import { Server } from 'next';
import { NextAppRequest } from '../types';

export function withRenderer(controller, app: Server, route: string) {
	return (req, res, next) => controller(req, res, next, app, route);
}

export function verifyUser(req: Request, res: Response, next: NextFunction) {
	if (process.env.NODE_ENV !== 'production') {
		next();
	}

	if (req.session && req.session.user) {
		return next();
	}

	if (req.xhr) {
		return res.status(401).send({
			message: 'session not recognised, make sure session cookie is present, or log in again',
		});
	}

	res.redirect('/login');
}

export function xhrOnly(req: NextAppRequest, res: Response, next) {
	if (req.xhr) {
		return next();
	}

	res.status(406);
	const error = new Error('This is route is only accessible via XHR request');
	error.name = 'Not allowed';

	next(error);
}
