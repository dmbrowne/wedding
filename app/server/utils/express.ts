import { Request, Response, NextFunction } from 'express';
import { Server } from 'next';
import models from '../models';

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

export function getOrAddGameToSession(req: Request, res: Response, next: NextFunction) {
	const { game } = req.session;
	const { gameId } = req.params;

	if (game && game.id === gameId) {
		return next();
	}

	models.Game.findOne({
		where: { id: gameId },
	})
	.then((game: any) => {
		req.session.game = game;
		return next();
	});
}

export function verifyGameIsInSession(req: Request, res: Response, next: NextFunction) {
	if (!req.session.game) {
		throw Error('Active game not found in session object');
	}
	next();
}

export function sessionGameBelongsToSessionUser(req: Request, res: Response, next: NextFunction) {
	const { user, game } = req.session;
	if (game.userId !== user.id) {
		if (req.xhr) {
			return res.status(403).json({ message: 'This game does not belong to the user logged in' });
		}
		throw Error('This game does not belong to the user logged in');
	}
	return next();
}
