import { restfulRequest } from './utils';
import { IAttendee, ISendGroup } from '../../server/types/models';

export function getSendGroups(id?: string) {
	return restfulRequest({
		route: id ? `admin/sendgroups/${id}` : 'admin/sendgroups',
	});
}

function sendGroup(
	groupDetails: Pick<ISendGroup, 'name'> | null,
	attendeeIds?: Array<IAttendee['id']>,
	groupId?: string,
) {
	return restfulRequest({
		route: groupId ? `admin/sendgroups/${groupId}` : 'admin/sendgroups',
		method: groupId ? 'PUT' : 'POST',
		body: JSON.stringify({
			...groupDetails ? groupDetails : {},
			attendeeIds,
		}),
	});
}

export function createSendGroup(
	groupDetails: Pick<ISendGroup, 'name' | 'email'> | null,
	attendeeIds?: Array<IAttendee['id']>,
) {
	return sendGroup(groupDetails, attendeeIds);
}

export function editSendGroup(
	groupId: string,
	groupDetails: Pick<ISendGroup, 'name' | 'email'> | null,
	attendeeIds?: Array<IAttendee['id']>,
) {
	return sendGroup(groupDetails, attendeeIds, groupId);
}

export function deleteGroup(groupIds: string | string[]) {
	const multipleDeletion = Array.isArray(groupIds);
	const route = (multipleDeletion ?
		'admin/sendgroups' :
		`admin/sendgroups/${groupIds}`
	);

	const body = (multipleDeletion ?
		JSON.stringify({ sendGroupIds: groupIds }) :
		undefined
	);

	return restfulRequest({
		route,
		method: 'DELETE',
		body,
	});
}

export function deleteSendGroup(groupId: string) {
	return deleteGroup(groupId);
}

export function deleteSendGroups(groupIds: string[]) {
	return deleteGroup(groupIds);
}
