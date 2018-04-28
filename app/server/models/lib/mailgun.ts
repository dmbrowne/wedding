import * as mailgun from 'mailgun-js';
import mailGunConfig from '../../../../config/mailgun';

const { apiKey, publicKey, domain, from } = mailGunConfig;

const mg = mailgun({
	apiKey,
	publicKey,
	domain,
});

export const variables = {
	from,
	domain,
};

export default mg;
