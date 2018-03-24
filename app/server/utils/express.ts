import { Request, Response, NextFunction } from 'express';
import { Server } from 'next';
import { NextAppRequest } from '../types';
import { INSPECT_MAX_BYTES } from 'buffer';

export function withRenderer(controller, app: Server, route: string) {
	return (req, res, next) => controller(req, res, next, app, route);
}

export function verifyUser(req: Request, res: Response, next: NextFunction) {
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

	return req.nextAppRenderer.renderError(
		Error('This is route is only accessible via XHR request'),
		req,
		res,
		req.originalUrl,
	);
}
