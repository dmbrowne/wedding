
// interface CreateAttendeeInput {
// 	firstName: string;
// 	lastName: string;
// 	email?: string;
// }
const host = 'http://localhost:4000';

const defaultHeaders = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	"X-Requested-With": 'XMLHttpRequest',
}

const defaultOptions = {
	credentials: 'include',
	headers: defaultHeaders
}

const errorHandler = (res: Response) => {
	if (res.status >= 300) {
		throw res;
	}
	return res.json();
}

const restfulRequest = (opts) => {
	const { route, resourceType = 'GET', routeParamId, body } = opts;
	const options = {
		...defaultOptions,
		method: resourceType,
		headers: { ...defaultHeaders },
	}
	
	if (body) {
		options.body = body;
	}

	return fetch(
		`${host}/${route}${routeParamId ? '/' + routeParamId : ''}`,
		options,
	)
	.then(errorHandler);
}

export function createAttendees(attendees) {
	return restfulRequest({
		route: 'admin/attendees',
		resourceType: 'POST',
		body: JSON.stringify({
			newAttendees: attendees
		}),
	})
}

export function deleteAttendees(attendeeIds) {
	return restfulRequest({
		route: 'admin/attendees',
		resourceType: 'DELETE',
		body: JSON.stringify({
			attendeeIds,
		}),
	})
}

export function editAttendee(attendeeId, values) {
	return restfulRequest({
		route: 'admin/attendees',
		routeParamId: attendeeId,
		resourceType: 'PUT',
		body: JSON.stringify({
			...values,
		}),
	})
}