import Sequelize, { Model } from 'sequelize';

export default class EventAttendee extends Model {
	static init(sequelizeConnection) {
		super.init({
			eventId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			attendeeId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			attending: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			confirmed: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize: sequelizeConnection,
		});
		return EventAttendee;
	}

	eventId: string;
	attendeeId: string;
	attending: boolean;
	confirmed: boolean;
}
