import { restfulRequest, multipartFormRequest } from './utils';

export const getAllImages = () => {
	return restfulRequest({
		route: 'admin/gallery',
	});
};

export const deleteImage = (galleryId) => {
	return restfulRequest({
		route: `admin/gallery/${galleryId}`,
		method: 'DELETE',
	});
};

export const uploadImage = (file: File | FormData) => {
	return multipartFormRequest({
		route: 'admin/gallery',
		body: file,
	});
};
