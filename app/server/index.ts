import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as next from 'next';
import * as bodyParser from 'body-parser';

import redisConfig = require('../../config/redis.json');
import userRoutes from './routes/userRoutes';
import attendeeRoutes from './routes/attendeeRoutes';
import sendGroupRoutes from './routes/sendGroupRoutes';
import eventsRoutes from './routes/eventRoutes';

const RedisStore = connectRedis(session);
const port = 4000;
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
	configureErrorMiddle(server);

	server.listen(portNumber, (err) => {
		if (err) {
			throw err;
		}
		console.log(`> Ready on http://localhost:${portNumber}`);
	});

	return server;
}

function configureRoutes(server) {
	server.use('/admin', userRoutes);
	server.use('/admin/attendees', attendeeRoutes);
	server.use('/admin/sendgroups', sendGroupRoutes);
	server.use('/admin/events', eventsRoutes);
	server.get('*', (req, res) => handler(req, res));
}

function configureRouteMiddleware(server) {
	server.use(bodyParser.urlencoded({ extended: true }));
	server.use(bodyParser.json());
	server.use(session({
		store: new RedisStore(redisConfig[process.env.NODE_ENV || 'development']),
		secret: 'theNewBrownesWeeding',
		resave: false,
		saveUninitialized: false,
	}));

	server.use('/static', express.static(path.join(__dirname, '../client', '.next/static')));
	server.use('/assets', express.static(path.join(__dirname, '../client', 'assets')));

	server.use((req, _, expressNext: express.NextFunction) => {
		req.nextAppRenderer = app;
		expressNext();
	});
}

function configureErrorMiddle(server) {
	server.use(logErrors);
	server.use(clientErrorHandler);
	server.use(errorHandler);
}

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  // res.status(500)
  req.nextAppRenderer.renderError(err, req, res, '/')
}