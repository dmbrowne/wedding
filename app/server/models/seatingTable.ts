import Sequelize, { Model } from 'sequelize';

export interface ITable {
	name: string;
}

export default class SeatingTable extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: Sequelize.STRING,
		},
		{
			sequelize: sequelizeConnection,
		});
		return SeatingTable;
	}

	static associate(models) {
		this.hasMany(models.Attendee, { as: 'TableGuest' });
	}
}
