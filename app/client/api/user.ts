import { restfulRequest } from './utils';

export function getAllUsers() {
	return restfulRequest({
		route: 'admin/users',
	});
}

export function getUser(userId) {
	return restfulRequest({
		route: `admin/users/${userId}`,
	});
}

export function createNewUser(input) {
	return restfulRequest({
		route: 'admin/users',
		method: 'post',
		body: JSON.stringify({
			email: input.email,
			password: input.password,
			firstName: input.firstName,
			lastName: input.lastName,
			role: input.role,
		}),
	});
}

export function updateUser(userId, input) {
	return restfulRequest({
		route: `admin/users/${userId}`,
		method: 'put',
		body: JSON.stringify({
			email: input.email,
			password: input.password,
			firstName: input.firstName,
			lastName: input.lastName,
			role: input.role,
		}),
	});
}

export function deleteUser(userId) {
	return restfulRequest({
		route: `admin/users/${userId}`,
		method: 'delete',
	});
}
