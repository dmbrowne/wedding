import Sequelize, { Model, HasManyGetAssociationsMixin } from 'sequelize';
import BridalParty from './bridalParty';

export default class BridalPartyRole extends Model {
	static rawAttributes = {
		name: { type: Sequelize.STRING },
		value: { type: Sequelize.STRING },
	};

	static init(sequelizeConnection) {
		super.init(this.rawAttributes,
		{
			sequelize: sequelizeConnection,
			timestamps: false,
		});
		return BridalPartyRole;
	}

	static associate(models) {
		this.hasMany(models.BridalParty, {
			as: 'BridalParties',
			foreignKey: 'partyRoleId',
			onDelete: 'CASCADE',
		});
	}

	static deleteByIds(ids) {
		return this.destroy({
			where: { id: ids },
		});
	}

	name: string;
	value: string;
	BridalParties: HasManyGetAssociationsMixin<BridalParty>;
}
