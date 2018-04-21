import Sequelize, { Model, BelongsToCreateAssociationMixin } from 'sequelize';
import Attendee from './attendee';

export type FoodChoiceType = 'meat' | 'fish' | 'vegetarian';

export default class FoodChoice extends Model {
	static rawAttributes = {
		attendeeId: { primaryKey: true, allowNull: false, type: Sequelize.UUID },
		starter: { type: Sequelize.ENUM('meat', 'fish', 'vegetarian') },
		main: { type: Sequelize.ENUM('meat', 'fish', 'vegetarian') },
		allergies: { type: Sequelize.TEXT },
	};

	static init(sequelizeConnection) {
		super.init(this.rawAttributes, {
			sequelize: sequelizeConnection,
			timestamps: false,
		});
	}

	static associate(models) {
		this.belongsTo(models.Attendee, {
			foreignKey: 'attendeeId',
			onDelete: 'CASCADE',
		});
	}

	starter: FoodChoiceType;
	main: FoodChoiceType;
	allergies: string;
	attendeeId: string;
	attendee: BelongsToCreateAssociationMixin<Attendee>;
}
