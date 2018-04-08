import Sequelize, { Model, BelongsToManyGetAssociationsMixin } from 'sequelize';
import Event from './event';
import SendGroup from './sendGroup';

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
		this.belongsToMany(models.Event, { as: 'Events', through: models.EventAttendee, foreignKey: 'attendeeId' });
		this.belongsTo(models.SeatingTable, { foreignKey: 'tableId' });
		this.belongsTo(models.SendGroup, { foreignKey: 'sendGroupId' });
		this.belongsToMany(models.Campaign, { through: models.CampaignAttendee, foreignKey: 'campaignId' });
	}

	id: string;
	email: string;
	firstName: string;
	lastName: string;
	tableId: string;
	sendGroupId: string;
	createdAt: Date;
	updatedAt: Date;
	Events?: Event[];
	SendGroup: SendGroup;
	getEvents: BelongsToManyGetAssociationsMixin<Event>;

	updateEventAttendance = async (rsvps: {[eventId: string]: boolean }) => {
		const events = this.Events || await this.getEvents();
		const updateEventsPromise = Promise.all(
			events.reduce((promises, event) => {
				const eventId = event.id;
				if (!(eventId in rsvps)) {
					return promises;
				}
				const attending = rsvps[event.id];
				const updatePromise = event.update({ confirmed: true, attending });
				return [
					...promises,
					updatePromise,
				];
			}, []),
		);
		return updateEventsPromise;
	}
}
