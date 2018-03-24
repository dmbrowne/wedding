import { Request } from 'express';
import { Server } from 'next';

export interface NextAppRequest extends Request {
	nextAppRenderer: Server;
}
