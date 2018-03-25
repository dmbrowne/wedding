import { restfulRequest } from './utils';
import { IAttendee } from '../../server/types/models';

type CreateAttendeeInput = Pick<IAttendee, 'firstName' | 'lastName' | 'email'>;

export function createAttendees(attendees: CreateAttendeeInput[]) {
	return restfulRequest({
		route: 'admin/attendees',
		resourceType: 'POST',
		body: JSON.stringify({
			newAttendees: attendees,
		}),
	});
}

export function deleteAttendees(attendeeIds: string[]) {
	return restfulRequest({
		route: 'admin/attendees',
		resourceType: 'DELETE',
		body: JSON.stringify({
			attendeeIds,
		}),
	});
}

export function editAttendee(attendeeId: string, values: CreateAttendeeInput) {
	return restfulRequest({
		route: `admin/attendees/${attendeeId}`,
		resourceType: 'PUT',
		body: JSON.stringify({
			...values,
		}),
	});
}
