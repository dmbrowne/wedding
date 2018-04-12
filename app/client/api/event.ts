import { restfulRequest } from './utils';
import { IEvent } from '../../server/types/models';

type CreateEventInput = {name: IEvent['name']} & Pick<IEvent, 'entryTime' | 'startTime' | 'endTime' | 'description' | 'imageId'>;

export function getEvents() {
	return restfulRequest({
		route: 'admin/events',
	});
}

export function createEvent(event: CreateEventInput) {
	return restfulRequest({
		route: 'admin/events',
		method: 'POST',
		body: JSON.stringify(event),
	});
}

export function deleteEvent(eventId: string) {
	return restfulRequest({
		route: `admin/events/${eventId}`,
		method: 'DELETE',
	});
}

export function editEvent(eventId: string, values: CreateEventInput) {
	return restfulRequest({
		route: `admin/events/${eventId}`,
		method: 'PUT',
		body: JSON.stringify(values),
	});
}

export function getEventAttendees(eventId) {
	return restfulRequest({
		route: `admin/events/${eventId}/attendees`,
	});
}

export function setEventAttendees(eventId, attendeeIds) {
	return restfulRequest({
		route: `admin/events/${eventId}/attendees`,
		method: 'POST',
		body: JSON.stringify({attendeeIds}),
	});
}
