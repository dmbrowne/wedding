import Sequelize, { Model } from 'sequelize';

export interface IEventAttendee {
	eventId: string;
	attendeeId: string;
	attending: boolean;
}

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
			attending: Sequelize.BOOLEAN,
		},
		{
			sequelize: sequelizeConnection,
		});
		return EventAttendee;
	}
}
