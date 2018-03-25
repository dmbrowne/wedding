import { restfulRequest } from './utils';
import { IEvent } from '../../server/types/models';

type CreateEventInput = IEvent['name'] & Pick<IEvent, 'startTime' | 'endTime' | 'description'>;

export function createAttendees(event: CreateEventInput[]) {
	return restfulRequest({
		route: 'admin/events',
		resourceType: 'POST',
		body: JSON.stringify(event),
	});
}

export function deleteAttendees(eventId: string) {
	return restfulRequest({
		route: `admin/attendees/${eventId}`,
		resourceType: 'DELETE',
	});
}

export function editAttendee(eventId: string, values: CreateEventInput) {
	return restfulRequest({
		route: `admin/attendees/${eventId}`,
		resourceType: 'PUT',
		body: JSON.stringify(values),
	});
}
