import * as mailgun from 'mailgun-js';
import mailGunConfig = require('../../../config/mailgun.json');

const { apiKey, publicKey } = mailGunConfig;
const mg = mailgun({ username: 'api', apiKey, publicKey, domain: 'thebrownes.info' });

export function sendMail(req, res) {
	const data = {
		from: 'The Brownes <y-and-d@thebrownes.info>',
		to: 'daryl.browne@hotmail.com,',
		subject: 'Our special day',
		text: "Thank you for confirming attendence, we look forward to seeing you on the big day",
	};

	mg.messages().send(data, function (error, body) {
		if (error) {
			const { name, message } = error;
			return res.status(500).send({ name, message })
		}
		res.send(body)
		console.log(body);
	});


}
