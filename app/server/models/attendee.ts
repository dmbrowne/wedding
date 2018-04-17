import Sequelize, { Model, HasManyHasAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToSetAssociationMixin } from 'sequelize';
import EventModel from './event';
import SendGroup from './sendGroup';
import EventAttendee from './eventAttendee';
import Campaign from './campaign';
import FoodChoice, { ChoiceTypes } from './foodChoice';
import GalleryImage from './galleryImage';

interface EventWithDetailsJoin extends EventModel {
	EventAttendee: EventAttendee;
}

interface GetApplicableAttendeeRecipientVars {
	attendees?: Attendee[];
	attendeeIds?: Attendee['id'] | string[];
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
		this.hasOne(models.FoodChoice, { foreignKey: 'attendeeId', onDelete: 'CASCADE' });
	}

	static async getApplicableRecipientVars(options: GetApplicableAttendeeRecipientVars) {
		if (!options.attendees && !options.attendeeIds) {
			throw Error('attendees or attendeeIds required');
		}

		let { attendees } = options;
		const { attendeeIds } = options;

		if (attendeeIds) {
			attendees = await this.findAll({
				where: {
					id: attendeeIds,
					email: !null,
				},
			});
		}

		const applicableSendees = attendeeIds ? attendees : attendees.filter(group => group.getDataValue('email'));
		const sendAddresses = applicableSendees.map(group => group.getDataValue('email'));
		const recipientVars = applicableSendees.reduce((accum, attendee) => {
			return {
				...accum,
				[attendee.getDataValue('email')]: {
					first: attendee.firstName,
					last: attendee.lastName,
					invitationlink: `http://thebrownes.info/invitation/a/${attendee.id}`,
				},
			};
		}, {});

		return {
			applicableSendees,
			sendAddresses,
			recipientVars,
		};
	}

	static getAttendeeWtihInvitedEvents(id) {
		return this.findById(id, {
			order: [
				[{ model: EventModel, as: 'Events' }, 'startTime', 'ASC'],
			],
			include: [{
				model: EventModel,
				as: 'Events',
				include: [{
					model: GalleryImage,
					as: 'featureImage',
				}],
			}, {
				model: FoodChoice,
			}],
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
	FoodChoice: FoodChoice;
	getEvents: BelongsToManyGetAssociationsMixin<EventWithDetailsJoin>;
	hasEvent: HasManyHasAssociationMixin<EventWithDetailsJoin, EventWithDetailsJoin['id']>;
	getCampaigns: BelongsToManyGetAssociationsMixin<Campaign>;
	setFoodChoice: BelongsToSetAssociationMixin<FoodChoice, FoodChoice['attendeeId']>;

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

	selectFood(input: {starter: ChoiceTypes, main: ChoiceTypes, allergies?: string | null}): PromiseLike<any> {
		return FoodChoice.upsert({
			attendeeId: this.id,
			...input,
		});
	}
}
