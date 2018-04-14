import { restfulRequest } from './utils';
import BridalParty from '../../server/models/bridalParty';
import BridalPartyRole from '../../server/models/bridalPartyRoles';

type CreateOrUpdatePartyInput = Partial<BridalParty>;
type CreateOrUpdateRoleInput = Partial<BridalPartyRole>;

export const getBridalParties = () => {
	return restfulRequest({
		route: 'admin/bridalParties',
	});
};

export const getBridalPartyRoles = () => {
	return restfulRequest({
		route: 'admin/bridalParties/roles',
	});
};

export const createBridalParty = (bridalPartyInput: CreateOrUpdatePartyInput) => {
	return restfulRequest({
		route: `admin/bridalParties`,
		method: 'POST',
		body: JSON.stringify({
			bridalPartyInput,
		}),
	});
};

export const createBridalPartyRole = (bridalPartyRoleInput: CreateOrUpdateRoleInput) => {
	return restfulRequest({
		route: `admin/bridalParties/roles`,
		method: 'POST',
		body: JSON.stringify({
			bridalPartyRoleInput,
		}),
	});
};

export const getBridalParty = (id) => {
	return restfulRequest({
		route: `admin/bridalParties/${id}`,
	});
};

export const updateBridalParty = (id, updateBridalPartyInput: CreateOrUpdatePartyInput) => {
	return restfulRequest({
		route: `admin/bridalParties/${id}`,
		method: 'PUT',
		body: JSON.stringify({
			updateBridalPartyInput,
		}),
	});
};

export const updateBridalPartyRole = (id, bridalPartyRoleUpdateInput: CreateOrUpdateRoleInput) => {
	return restfulRequest({
		route: `admin/bridalParties/roles/${id}`,
		method: 'PUT',
		body: JSON.stringify({
			bridalPartyRoleUpdateInput,
		}),
	});
};

export const deleteBridalParty = (id) => {
	return restfulRequest({
		route: `admin/bridalParties/${id}`,
		method: 'DELETE',
	});
};

export const deleteBridalParties = (ids) => {
	return restfulRequest({
		route: 'admin/bridalParties',
		method: 'DELETE',
		body: JSON.stringify({
			bridalPartyIds: ids,
		}),
	});
};

export const deleteBridalPartyRoles = (ids) => {
	return restfulRequest({
		route: 'admin/bridalParties/roles',
		method: 'DELETE',
		body: JSON.stringify({
			bridalRoleIds: ids,
		}),
	});
};
