import * as stripeApi from 'stripe';
import { secretKey } from '../../../config/stripeKeys';

const stripe = new stripeApi(secretKey);

export function donate(req, res, next) {
	const { amount, token, description } = req.body;
	stripe.charges.create({
		amount,
		description,
		currency: 'gbp',
		source: token,
		receipt_email: 'yasmin.obosi@gmail.com',
	})
	.then(charge => {
		res.send(charge);
	})
	.catch(e => {
		next(e);
	});
}
