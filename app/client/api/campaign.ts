import { restfulRequest } from './utils';
import Campaign from '../../server/models/campaign';
import { RawDraftContentState } from 'draft-js';

interface CreateCampaignInput extends Partial<Campaign> {
	content: any | RawDraftContentState;
}

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
		route: 'admin/campaigns',
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

export function sendCampaigns(campaignIds: string[]) {
	return restfulRequest({
		route: 'admin/campaigns/send',
		method: 'POST',
		body: JSON.stringify({campaignIds}),
	});
}
