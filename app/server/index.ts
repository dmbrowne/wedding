import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as next from 'next';
import * as bodyParser from 'body-parser';

import redisConfig = require('../../config/redis.json');
import userRoutes from './routes/user';

const RedisStore = connectRedis(session);
const port = 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
	dir: './app/client',
	dev,
});
const handler = app.getRequestHandler();
const sessionHandler = session({
	store: new RedisStore(redisConfig[process.env.NODE_ENV || 'development']),
	secret: 'theNewBrownesWeeding',
	resave: true,
	saveUninitialized: true,
});

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

	server.listen(portNumber, (err) => {
		if (err) {
			throw err;
		}
		console.log(`> Ready on http://localhost:${portNumber}`);
	});

	return server;
}

function configureRoutes(server) {
	server.use('/', userRoutes);
	server.get('*', (req, res) => handler(req, res));
}

function configureRouteMiddleware(server) {
	server.use(bodyParser.urlencoded());
	server.use(bodyParser.json());
	server.use(sessionHandler);

	server.use('/static', express.static(path.join(__dirname, '../client', '.next/static')));
	server.use('/assets', express.static(path.join(__dirname, '../client', 'assets')));

	server.use((req, _, expressNext: express.NextFunction) => {
		req.nextAppRenderer = app;
		expressNext();
	});
}
