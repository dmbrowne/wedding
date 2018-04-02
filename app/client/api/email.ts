import { restfulRequest } from './utils';

export const sendAttendeeEmails = (input) => {
	return restfulRequest({
		route: 'admin/email',
		method: 'POST',
		body: JSON.stringify({
			subject: input.subject,
			content: input.content,
		}),
	});
}
