import Sequelize, { Model, BelongsToCreateAssociationMixin } from 'sequelize';
import BridalPartyRole from './bridalPartyRoles';
import GalleryImage from './galleryImage';

export default class BridalParty extends Model {
	static rawAttributes = {
		firstName: { type: Sequelize.STRING },
		lastName: { type: Sequelize.STRING },
		comment: { type: Sequelize.STRING },
		imageId: { type: Sequelize.UUID },
		partyRoleId: { type: Sequelize.INTEGER },
		subRole: { type: Sequelize.STRING },
		vip: { type: Sequelize.BOOLEAN },
		order: { type: Sequelize.INTEGER, defaultValue: 1 },
	};

	static defaultIncludeOptions = [{
		model: GalleryImage,
		as: 'Image',
	}, {
		model: BridalPartyRole,
		as: 'WeddingRole',
	}];

	static init(sequelizeConnection) {
		super.init(this.rawAttributes,
		{
			sequelize: sequelizeConnection,
		});
		return BridalParty;
	}

	static associate(models) {
		this.belongsTo(models.GalleryImage, {
			as: 'Image',
			foreignKey: 'imageId',
			onDelete: 'SET NULL',
		});
		this.belongsTo(models.BridalPartyRole, {
			as: 'WeddingRole',
			foreignKey: 'partyRoleId',
			onDelete: 'SET NULL',
		});
	}

	static getAllBridalParties() {
		return this.findAll({ include: this.defaultIncludeOptions });
	}

	static getById(id) {
		return this.findById(id, { include: this.defaultIncludeOptions });
	}

	static deleteBridalPartiesById(ids) {
		return this.destroy({
			where: { id: ids },
		});
	}

	id: string;
	firstName: string;
	lastName: string;
	comment: string;
	subRole: string;
	imageId: string;
	partyRoleId: number;
	vip: boolean;
	order: number;
	WeddingRole: BridalPartyRole;
	Image: GalleryImage;
}
