import { Server } from 'next';

declare global {
	namespace Express {
		interface Request {
			nextAppRenderer: Server;
		}
	}
}