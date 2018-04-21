import * as stripeApi from 'stripe';
import stripeApiKeys from '../../../config/stripeKeys';
import models from '../models';

const { secretKey } = stripeApiKeys[process.env.NODE_ENV || 'development'];

const stripe = new stripeApi(secretKey);

export async function donate(req, res, next) {
	const { amount, token, description, message } = req.body;

	if (message) {
		await models.Donation.create({ message, amount });
	}

	stripe.charges.create({
		amount,
		description,
		currency: 'gbp',
		source: token,
		receipt_email: req.body.email,
	})
	.then(charge => {
		res.send(charge);
	})
	.catch(e => {
		next(e);
	});
}
