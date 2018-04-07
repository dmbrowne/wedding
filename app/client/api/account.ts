import { restfulRequest } from './utils';

export const getUserAccount = () => {
	return restfulRequest({
		route: 'me',
	});
};

export const updateAccount = (input) => {
	return restfulRequest({
		route: 'me',
		method: 'PUT',
		body: JSON.stringify({
			email: input.email,
			username: input.username,
		}),
	});
};

export const changePassword = (input) => {
	return restfulRequest({
		route: 'me/password',
		method: 'PUT',
		body: JSON.stringify({
			currentPassword: input.currentPassword,
			newPassword: input.newPassword,
		}),
	});
};
