import * as environments from './secrets/stripe.json';

const { publicKey, secretKey } = environments[process.env.NODE_ENV || 'development'] as any;

export default {
	publicKey,
	secretKey,
};
