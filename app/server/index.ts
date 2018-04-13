import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as next from 'next';
import * as bodyParser from 'body-parser';

import redisConfig = require('../../config/redis.json');
import accountRoutes from './routers/accountRoutes';
import attendeeRoutes from './routers/attendeeRoutes';
import sendGroupRoutes from './routers/sendGroupRoutes';
import eventRoutes from './routers/eventRoutes';
import userRoutes from './routers/userRoutes';
import invitationRoutes from './routers/invitationRoutes';
import galleryRoutes from './routers/galleryRoutes';
import campaignRoutes from './routers/campaignRoutes';
import { donate } from './routers/donateRouters';
import { sendMail } from './controllers/emailController';
import { NextAppRequest } from './types';
import { verifyUser } from './utils/express';

const RedisStore = connectRedis(session);
const port = process.env.PORT || 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
	dir: './app/client',
	dev,
});
const handler = app.getRequestHandler();

export function startApp() {
	app
		.prepare()
		.then(() => {
			startServer(port);
		})
		.catch((ex) => {
			console.error(ex.stack);
			process.exit(1);
		});
}

function startServer(portNumber) {
	const server = express();
	configureRouteMiddleware(server);
	configureRoutes(server);
	configureErrorMiddleware(server);

	server.listen(portNumber, (err) => {
		if (err) {
			throw err;
		}
		console.log(`> Ready on http://localhost:${portNumber}`);
	});

	return server;
}

function configureRoutes(server) {
	server.use('/', accountRoutes);
	server.use('/admin/email', sendMail);
	server.use('/admin/users', userRoutes);
	server.use('/admin/attendees', attendeeRoutes);
	server.use('/admin/sendgroups', sendGroupRoutes);
	server.use('/admin/events', eventRoutes);
	server.use('/admin/gallery', galleryRoutes);
	server.use('/admin/campaigns', campaignRoutes);
	server.use('/invitation', invitationRoutes);
	server.get('/admin', verifyUser, (req: NextAppRequest, res) => {req.nextAppRenderer.render(req, res, '/dashboard')});
	server.get('/admin/myaccount',
		verifyUser,
		(req: NextAppRequest, res) => {req.nextAppRenderer.render(req, res, '/account')}
	);
	server.post('/charge', donate);
	server.get('/admin/sendInvites', verifyUser, (req, res) => req.nextAppRenderer.render(req, res, '/sendInvites'));
	server.get('*', (req, res) => handler(req, res));
}

function configureRouteMiddleware(server) {
	server.use(bodyParser.urlencoded({ extended: true }));
	server.use(bodyParser.json());
	server.use(session({
		store: new RedisStore(redisConfig[process.env.NODE_ENV || 'development']),
		secret: 'theNewBrownesWeeding',
		resave: true,
		saveUninitialized: true,
	}));

	server.use('/static', express.static(path.join(__dirname, '../client/dist', '.next/static')));
	server.use('/assets', express.static(path.join(__dirname, '../client/dist', 'assets')));

	server.use((req, _, expressNext: express.NextFunction) => {
		req.nextAppRenderer = app;
		expressNext();
	});
}

function configureErrorMiddleware(server) {
	server.use(logErrors);
	server.use(clientErrorHandler);
	server.use(errorHandler);
}

function logErrors(err: Error, _, _2, nextFunction: express.NextFunction) {
	const { name, message, stack } = err;
	console.error({ name, message, stack });
	nextFunction(err);
}

function clientErrorHandler(err, req, res, nextFunction) {
	const { name, message, stack } = err;
	if (req.xhr) {
		res.status(500).json({ name, message, stack });
	} else {
		nextFunction(err);
	}
}

function errorHandler(err: Error, req: NextAppRequest, res: express.Response, _) {
	req.nextAppRenderer.renderError(err, req, res, req.path);
}
