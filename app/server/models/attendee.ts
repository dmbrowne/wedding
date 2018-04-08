import Sequelize, { Model, HasManyHasAssociationMixin, BelongsToManyGetAssociationsMixin } from 'sequelize';
import Event from './event';
import SendGroup from './sendGroup';
import EventAttendee from './eventAttendee';

interface EventWithDetailsJoin extends Event {
	EventAttendee: EventAttendee;
}

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
		this.belongsToMany(models.Event, { through: models.EventAttendee, foreignKey: 'attendeeId' });
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
	Events?: EventWithDetailsJoin[];
	SendGroup: SendGroup;
	getEvents: BelongsToManyGetAssociationsMixin<EventWithDetailsJoin>;
	hasEvent: HasManyHasAssociationMixin<EventWithDetailsJoin, EventWithDetailsJoin['id']>;

	updateEventAttendance = (models, rsvps: {[eventId: string]: boolean }) => {
		return Promise.all(
			Object.keys(rsvps).map(eventId => {
				return models.EventAttendee.update({
					confirmed: true,
					attending: rsvps[eventId],
				}, {
					where: {
						attendeeId: this.id,
						eventId,
					},
				});
			}),
		);
	}
}
