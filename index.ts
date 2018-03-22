import { authenticate as  sequelizeAuthenticate} from './app/server/models';
import { startApp } from './app/server';

sequelizeAuthenticate().then(() => {
	startApp();
})
.catch(err => {
	console.error('Unable to connect to the database:', err);
});