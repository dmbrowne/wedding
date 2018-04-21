import * as mailgun from 'mailgun-js';
import mailGunConfig from '../../../config/mailgun';
import models from '../models';
import * as path from 'path';

const { apiKey, publicKey, domain, from } = mailGunConfig[process.env.NODE_ENV || 'development'];
const mg = mailgun({
	apiKey,
	publicKey,
	domain,
});

async function getAttendeesThatArentInAGroup() {
	const attendeesThatArentInAGroup = await models.Attendee.findAll({
		where: {
			sendGroupId: null,
		},
	});

	const applicableSendees = attendeesThatArentInAGroup.filter(email => email);
	const sendAddresses = applicableSendees.map(attendee => attendee.getDataValue('email'));
	const recipientVars = applicableSendees.reduce((accum, attendee) => ({
		...accum,
		[attendee.email]: {
			first: attendee.firstName,
			last: attendee.lastName,
			invitationlink: models.Attendee.invitationUrl(attendee.id),
		},
	}), {});
	return {
		applicableSendees,
		sendAddresses,
		recipientVars,
	};
}

async function getSendGroups() {
	const sendGroups = await models.SendGroup.findAll({
		where: {
			email: !null,
		},
	});

	const applicableSendees = sendGroups.filter(email => email);
	const sendAddresses = applicableSendees.map(group => group.getDataValue('email'));
	const recipientVars = applicableSendees.reduce((accum, group) => ({
		...accum,
		[group.email]: {
			name: group.name,
			invitationlink: models.SendGroup.invitationUrl(group.id),
		},
	}), {});

	return {
		applicableSendees,
		sendAddresses,
		recipientVars,
	};
}

export async function sendMail(req, res) {
	const { subject, sendgroups } = req.body;
	let { content } = req.body;
	const filename = path.join(__dirname, '../../client/assets/y&d-logo.png');
	content = content.replace('%logo%', '<img width="150" src="cid:y&d-logo.png"/>');

	const { sendAddresses, recipientVars } = sendgroups ?
		await getSendGroups() :
		await getAttendeesThatArentInAGroup();

	const data = {
		'inline': filename,
		'to': sendAddresses,
		'from': `Dazza Youoo <${from}>`,
		// 'from': 'The Brownes <y-and-d@thebrownes.info>',
		'subject': subject,
		'recipient-variables': recipientVars,
		'html': content,
	};

	mg.messages().send(data, function (error, body) {
		if (error) {
			const { name, message } = error;
			return res.status(500).send({ name, message });
		}
		res.send({body});
	});
}
