import * as mailgun from 'mailgun-js';
import mailGunConfig = require('../../../config/mailgun.json');

const { apiKey, publicKey } = mailGunConfig;
const mg = mailgun({ username: 'api', apiKey, publicKey, domain: 'wedding.thebrownes.info' });

export function sendMail(req, res) {
	const data = {
		from: 'The Brownes <y&d@wedding.thebrownes.info>',
		to: 'daryl.browne@fluxionlabs.io',
		subject: 'You\'re invited to our wedding',
		html: '<h1>Hello Daryl</h1><p>You are invited to our wedding</p><p><a href="http://thebrownes.info">Visit</a> our save the date for more info.</p><br/><p>We hope to see you there</p>',
	};

	// mg.messages().send(data, function (error, body) {
	// 	if (error) {
	// 		return res.status(500).send(error)
	// 	}
	// 	res.send('ok')
	// 	console.log(body);
	// });


}
