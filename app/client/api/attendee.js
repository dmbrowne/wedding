import { restfulRequest } from './utils';
export function createAttendees(attendees) {
    return restfulRequest({
        route: 'admin/attendees',
        resourceType: 'POST',
        body: JSON.stringify({
            newAttendees: attendees,
        }),
    });
}
export function deleteAttendees(attendeeIds) {
    return restfulRequest({
        route: 'admin/attendees',
        resourceType: 'DELETE',
        body: JSON.stringify({
            attendeeIds,
        }),
    });
}
export function editAttendee(attendeeId, values) {
    return restfulRequest({
        route: `admin/attendees/${attendeeId}`,
        resourceType: 'PUT',
        body: JSON.stringify({
            ...values,
        }),
    });
}
