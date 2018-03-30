import * as mailgun from 'mailgun-js';
import mailGunConfig = require('../../../config/mailgun.json');

const { apiKey, publicKey } = mailGunConfig;
const mg = mailgun({ username: 'api', apiKey, publicKey, domain: 'thebrownes.info' });

export function sendMail(req, res) {
	const data = {
		from: 'The Brownes <y-and-d@thebrownes.info>',
		to: 'daryl.browne@hotmail.com, yasminobosi@yahoo.co.uk, daryl.browne@gmail.com',
		subject: 'Our special day',
		html: '<p>Hello Daryl,</p>\
		<p>As you know Yasmin and I will wed this year, October. You should have received a \
		link to our save the date previously, hopefully you did just that!</p>\
		<br/>\
		<p>Please do come and join us on our special day. A link to your invite is below.</p>\
		<p><a href="http://thebrownes.info/" alt="Daryls Invitation">Click here</a> for your invite</p>\
		<p>Please complete the RSVP at the bottom of the invite by the <strong>31st July</strong>.\
		unfortunately RSVP\'s completed after this date will not be considered and your place \
		<i>may</i> be given to someone else</p>\
		<br />\
		<p><i>Thank you once again, and hope to see you very soon!! :D</i></p>\
		<br/>\
		<br/>\
		Kind regards,<br/>\
		The future Mr. and Mrs. Browne of twenty eighteen',
	};

	res.send('ok')
	// mg.messages().send(data, function (error, body) {
	// 	if (error) {
	// 		const { name, message } = error;
	// 		return res.status(500).send({ name, message });
	// 	}
	// 	res.send(body)
	// 	console.log(body);
	// });


}
