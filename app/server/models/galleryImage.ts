import Sequelize, { Model } from 'sequelize';
import * as cloudinary from 'cloudinary';

(function initCloudinary() {
	cloudinary.config({
		cloud_name: 'liquidation',
		api_key: '391663233779628',
		api_secret: 'ulnuWOte5rRI0Du6JHxc6mD7pTc',
	});
})();

interface CloudinaryResponse {
	public_id: string;
	version: number;
	signature: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string;
	bytes: number;
	type: string;
	url: string;
	secure_url: string;
}
export default class GalleryImage extends Model {
	static rawAttributes = {
		publicId: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		width: { type: Sequelize.INTEGER },
		height: { type: Sequelize.INTEGER },
		format: { type: Sequelize.STRING },
		url: { type: Sequelize.STRING },
		secureUrl: { type: Sequelize.STRING },
		squareImage: {
			type: Sequelize.VIRTUAL,
			get: function getSquareImage() {
				return cloudinary.url(this.publicId, { width: 300, height: 300, crop: 'fill' });
			},
		},
	};

	static init(sequelizeConnection) {
		super.init(this.rawAttributes, {
			sequelize: sequelizeConnection,
		});
	}

	static addImageToCloudinary(filepath): Promise<CloudinaryResponse> {
		return new Promise((resolve, reject) => {
			cloudinary.v2.uploader.upload(filepath, { folder: 'wedding' }, (err: Error, result: CloudinaryResponse) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	}

	static deleteImageFromCloudinary(publicId) {
		return new Promise((resolve, reject) => {
			cloudinary.v2.uploader.upload(publicId, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	}

	static addNewImage(filepath) {
		return this.addImageToCloudinary(filepath)
			.then(cloudinaryResponse => {
				const { public_id , width , height , format , url, secure_url } = cloudinaryResponse;
				return GalleryImage.create({
					publicId: public_id,
					width,
					height,
					format,
					url,
					secureUrl: secure_url,
				});
			});
	}

	publicId: string;
	width: number;
	height: number;
	format: string;
	url: string;
	secureUrl: string;
	squareImage: string;
	createdAt: Date;
	updatedAt: Date;

	delete() {
		return GalleryImage.deleteImageFromCloudinary(this.publicId)
			.then(() => {
				this.destroy();
			})
			.catch(e => { throw new Error(e); });
	}
}
