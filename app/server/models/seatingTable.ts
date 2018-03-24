import Sequelize, { Model } from 'sequelize';

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
		this.hasMany(models.Attendee, { as: 'TableGuest', foreignKey: 'tableId' });
	}
}
