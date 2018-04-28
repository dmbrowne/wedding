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
