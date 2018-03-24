import Sequelize, { Model } from 'sequelize';

export default class Attendee extends Model {
	static init(sequelizeConnection) {
		super.init({
			email: {
				type: Sequelize.STRING,
				unique: true,
			},
			firstName: Sequelize.STRING,
			lastName: Sequelize.STRING,
			tableId: Sequelize.UUID,
			sendGroupId: Sequelize.UUID,
		},
		{
			sequelize: sequelizeConnection,
		});
		return Attendee;
	}

	static associate(models) {
		this.belongsToMany(models.Event, { through: models.EventAttendee, foreignKey: 'eventId' });
		this.belongsTo(models.SeatingTable, { foreignKey: 'tableId' });
		this.belongsTo(models.SendGroup, { foreignKey: 'sendGroupId' });
	}
}
