import * as environments from './secrets/stripe.json';

const { publicKey, secretKey } = environments as any;

export default {
	publicKey,
	secretKey,
};
