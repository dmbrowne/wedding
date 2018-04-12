import { Request } from 'express';
import { Server } from 'next';

export interface NextAppRequest extends Request {
	nextAppRenderer: Server;
}

export interface CloudinaryResponse {
	public_id: string;
	version: number;
	signature: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string;
	bytes: number;
	type: string;
	url: string;
	secure_url: string;
}