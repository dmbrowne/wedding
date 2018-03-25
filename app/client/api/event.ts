import { restfulRequest } from './utils';
import { IEvent } from '../../server/types/models';

type CreateEventInput = IEvent['name'] & Pick<IEvent, 'startTime' | 'endTime' | 'description'>;

export function createAttendees(event: CreateEventInput[]) {
	return restfulRequest({
		route: 'admin/events',
		method: 'POST',
		body: JSON.stringify(event),
	});
}

export function deleteAttendees(eventId: string) {
	return restfulRequest({
		route: `admin/attendees/${eventId}`,
		method: 'DELETE',
	});
}

export function editAttendee(eventId: string, values: CreateEventInput) {
	return restfulRequest({
		route: `admin/attendees/${eventId}`,
		method: 'PUT',
		body: JSON.stringify(values),
	});
}
