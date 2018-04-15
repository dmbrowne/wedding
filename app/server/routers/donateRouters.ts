import * as stripeApi from 'stripe';
import stripeApiKeys from '../../../config/stripeKeys';

const { secretKey } = stripeApiKeys[process.env.NODE_ENV || 'development'];

const stripe = new stripeApi(secretKey);

export function donate(req, res, next) {
	const { amount, token, description } = req.body;
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
