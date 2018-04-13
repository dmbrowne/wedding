import { restfulRequest } from './utils';
import { ICampaign } from '../../server/types/models';

type CreateCampaignInput = Partial<ICampaign>;

interface AttendeeInput {
	attendeeIds?: string[];
	sendGroupIds?: string[];
}

export function getAllCampaigns() {
	return restfulRequest({
		route: 'admin/campaigns',
	});
}

export function getCampaign(campaignId) {
	return restfulRequest({
		route: `admin/campaigns/${campaignId}`,
	});
}

export function createCampaign(campaignInput: CreateCampaignInput) {
	return restfulRequest({
		route: 'admin/campaigns',
		method: 'POST',
		body: JSON.stringify({
			campaign: campaignInput,
		}),
	});
}

export function editCampaign(campaignId: string, values: CreateCampaignInput, recipients?: AttendeeInput) {
	return restfulRequest({
		route: `admin/campaigns/${campaignId}`,
		method: 'PUT',
		body: JSON.stringify({
			campaign: values,
			...recipients,
		}),
	});
}

export function deleteCampaigns(campaignIds: string[]) {
	return restfulRequest({
		route: 'admin/attendees',
		method: 'DELETE',
		body: JSON.stringify({
			campaignIds,
		}),
	});
}

export function deleteCampaign(campaignId: string) {
	return restfulRequest({
		route: `admin/campaigns/${campaignId}`,
		method: 'DELETE',
	});
}
