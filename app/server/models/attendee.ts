import Sequelize, { Model, HasManyHasAssociationMixin, BelongsToManyGetAssociationsMixin } from 'sequelize';
import Event from './event';
import SendGroup from './sendGroup';
import EventAttendee from './eventAttendee';
import Campaign from './campaign';

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
		this.belongsToMany(models.Event, {
			through: models.EventAttendee,
			foreignKey: 'attendeeId',
			onDelete: 'CASCADE',
		});
		this.belongsTo(models.SeatingTable, { foreignKey: 'tableId', onDelete: 'CASCADE' });
		this.belongsTo(models.SendGroup, { foreignKey: 'sendGroupId', onDelete: 'CASCADE' });
		this.belongsToMany(models.Campaign, {
			through: models.CampaignAttendee,
			foreignKey: 'attendeeId',
			onDelete: 'CASCADE',
		});
	}

	id: string;
	email: string;
	firstName: string;
	lastName: string;
	tableId: string;
	sendGroupId: string;
	campaignId: string;
	createdAt: Date;
	updatedAt: Date;
	Events?: EventWithDetailsJoin[];
	Campaigns: Campaign[];
	SendGroup: SendGroup;
	getEvents: BelongsToManyGetAssociationsMixin<EventWithDetailsJoin>;
	hasEvent: HasManyHasAssociationMixin<EventWithDetailsJoin, EventWithDetailsJoin['id']>;
	getCampaigns: BelongsToManyGetAssociationsMixin<Campaign>;

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
