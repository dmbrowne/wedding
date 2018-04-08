import dbAuthenticate from './app/server/models/lib/dbAuthenticate';
import { startApp } from './app/server';

dbAuthenticate().then(() => {
	startApp();
})
.catch(err => {
	console.error('Unable to connect to the database:', err);
});