import { restfulRequest } from './utils';

export function getAll() {
	return restfulRequest({
		route: 'admin/emailtemplates',
	});
}

export function getById(emailTemplateId) {
	return restfulRequest({
		route: `admin/emailtemplates/${emailTemplateId}`,
	});
}

export function create(input) {
	return restfulRequest({
		route: 'admin/emailtemplates',
		method: 'post',
		body: JSON.stringify({
			name: input.name,
			draftContentState: input.draftContentState,
		}),
	});
}

export function update(emailTemplateId, input) {
	return restfulRequest({
		route: `admin/emailtemplates/${emailTemplateId}`,
		method: 'put',
		body: JSON.stringify(input),
	});
}

export function destroy(emailTemplateId) {
	return restfulRequest({
		route: `admin/emailtemplates/${emailTemplateId}`,
		method: 'delete',
	});
}
