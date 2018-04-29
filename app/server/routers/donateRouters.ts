import { Request, Response } from 'express';
import * as stripeApi from 'stripe';
import stripeApiKeys from '../../../config/stripeKeys';
import Donation from '../models/donation';

const { secretKey } = stripeApiKeys;

const stripe = new stripeApi(secretKey);

export async function donate(req, res, next) {
	const { amount, token, description, message, email } = req.body;

	stripe.charges.create({
		amount,
		description,
		currency: 'gbp',
		source: token,
		receipt_email: email,
	})
	.then(async charge => {
		if (message) {
			await Donation.create({ message, amount });
		}
		res.send(charge);
	})
	.catch(e => {
		next(e);
	});
}

export async function getAllDonations(req: Request, res: Response) {
	const donations = await Donation.findAll();
	res.locals.donations = donations;
	req.nextAppRenderer.render(req, res, '/donationslisting');
}

export function donationConfirmation(req: Request, res: Response) {
	const { amount } = req.query;
	res.locals.amount = amount;
	req.nextAppRenderer.render(req, res, `/donateThankYou`);
}
