import { restfulRequest } from './utils';
import Attendee from '../../server/models/attendee';

export interface CreateAttendeeInput {
	firstName: string;
	lastName?: string;
	email?: string;
	eventIds?: string[];
}

export function createAttendees(attendees: Array<Partial<Attendee>>) {
	return restfulRequest({
		route: 'admin/attendees',
		method: 'POST',
		body: JSON.stringify({
			newAttendees: attendees,
		}),
	});
}

export function deleteAttendees(attendeeIds: string[]) {
	return restfulRequest({
		route: 'admin/attendees',
		method: 'DELETE',
		body: JSON.stringify({
			attendeeIds,
		}),
	});
}

export function editAttendee(attendeeId: string, values: Partial<Attendee>) {
	return restfulRequest({
		route: `admin/attendees/${attendeeId}`,
		method: 'PUT',
		body: JSON.stringify({
			...values,
		}),
	});
}

export function searchForAttendee(terms: string) {
	const searchTerms = terms.split(' ').join(',');
	const encodedSearchTerms = encodeURIComponent(searchTerms);
	return restfulRequest({
		route: 'admin/attendees?search=' + encodedSearchTerms,
	});
}

export function getAllAttendees(emailable?: boolean) {
	return restfulRequest({
		route: `admin/attendees${emailable ? '?emailable=true' : ''}`,
	});
}
