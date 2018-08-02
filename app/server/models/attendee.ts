import Sequelize, { Model, HasManyHasAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToSetAssociationMixin } from 'sequelize';
import EventModel from './event';
import SendGroup from './sendGroup';
import EventAttendee from './eventAttendee';
import Campaign from './campaign';
import FoodChoice, { FoodChoiceType } from './foodChoice';
import GalleryImage from './galleryImage';
import mg, { variables as mailGunVariables } from './lib/mailgun';
import * as path from 'path';

const { from } = mailGunVariables;

export interface EventWithDetailsJoin extends EventModel {
	EventAttendee?: EventAttendee;
}

interface GetApplicableAttendeeRecipientVars {
	attendees?: Attendee[];
	attendeeIds?: Attendee['id'] | string[];
}

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://thebrownes.info' : 'http://localhost:4000';
export const invitationUrlPrefix = `${baseUrl}/invitation/a`;

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
			invitationUrl: {
				type: Sequelize.VIRTUAL,
				get: function getInvitationUrl() {
					return this.sendGroupId ?
						SendGroup.invitationUrl(this.sendGroupId) :
						Attendee.invitationUrl(this.id);
				},
			},
			sendGroupOrder: Sequelize.INTEGER,
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
		this.belongsTo(models.SeatingTable, { foreignKey: 'tableId', onDelete: 'SET NULL' });
		this.belongsTo(models.SendGroup, { foreignKey: 'sendGroupId', onDelete: 'SET NULL' });
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

	static invitationUrl = (attendeeId) => invitationUrlPrefix + '/' + attendeeId;

	static separateSingleAndGroupedAttendees(attendees) {
		const { grouped, singles } = attendees.reduce((accum, attendee) => {
			const newAttendees = (attendee.sendGroupId ?
				{[attendee.sendGroupId]: {
					...accum.grouped[attendee.sendGroupId],
					[attendee.id]: attendee,
				}} :
				{[attendee.id]: attendee}
			);

			return {
				grouped: {
					...accum.grouped,
					...(attendee.sendGroupId ? newAttendees : {}),
				},
				singles: {
					...accum.singles,
					...(!attendee.sendGroupId ? newAttendees : {}),
				},
			};
		}, { grouped: {}, singles: {} });

		const updatedGroupIds = Object.keys(grouped).filter(groupId => {
			const attendeeIds = Object.keys(grouped[groupId]);
			if (attendeeIds.length === 1) {
				singles[attendeeIds[0]] = grouped[groupId][attendeeIds[0]];
				return false;
			}
			return true;
		});
		const updatedGroups = updatedGroupIds.reduce((accum, groupId) => ({
			...accum,
			[groupId]: grouped[groupId],
		}), {});

		return {
			grouped: updatedGroups,
			singles,
		};
	}

	id: string;
	email: string;
	firstName: string;
	lastName: string;
	tableId: string;
	sendGroupId: string;
	campaignId: string;
	sendGroupOrder: number;
	createdAt: Date;
	updatedAt: Date;
	Events?: EventWithDetailsJoin[];
	Campaigns: Campaign[];
	SendGroup: SendGroup;
	FoodChoice: FoodChoice;
	getEvents: BelongsToManyGetAssociationsMixin<EventWithDetailsJoin>;
	hasEvent: HasManyHasAssociationMixin<EventWithDetailsJoin, EventWithDetailsJoin['id']>;
	setEvents: BelongsToSetAssociationMixin<EventWithDetailsJoin, string[]>;
	getCampaigns: BelongsToManyGetAssociationsMixin<Campaign>;
	setFoodChoice: BelongsToSetAssociationMixin<FoodChoice, FoodChoice['attendeeId']>;

	updateEventAttendance = (models, rsvps: {[eventId: string]: boolean }, confirmed?) => {
		return Promise.all(
			Object.keys(rsvps).map(async eventId => {
				const eventAttendee = await EventAttendee.findOne({
					where: { attendeeId: this.id, eventId },
				});
				return EventAttendee.update({
					confirmed: typeof confirmed === 'undefined' ? eventAttendee.getDataValue('confirmed') : confirmed,
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

	selectFood(input: {starter: FoodChoiceType, main: FoodChoiceType, allergies?: string | null}): PromiseLike<any> {
		return FoodChoice.upsert({
			attendeeId: this.id,
			...input,
		});
	}

	getInvite = async () => {
		const id = this.sendGroupId ?
			await SendGroup.findById(this.sendGroupId).then(({ id: sid }) => sid) :
			this.id;
		return {
			group: !!this.sendGroupId,
			id,
		};
	}

	async getInviteLink() {
		const inviteLink = await this.getInvite().then(({ group, id }) => `/invitation/${group ? 'g/' : 'a/'}` + id);
		return inviteLink;
	}

	async sendRsvpConfirmationEmail() {
		const filename = path.join(__dirname, '../../client/assets/y&d-logo.png');
		const name = this.getDataValue('firstName');
		const events = await this.getEvents();
		const attending = events.map(event => event.EventAttendee.attending).length > 0;
		const attendingMsg = 'We\'re really happy that you\'ll be attending, We can\'t wait to see you on the day';
		const unattendingMsg = 'Sorry you can\'t share our big day with us, however we hope to see you soon';
		const data = {
			inline: filename,
			to: this.getDataValue('email'),
			from,
			subject: 'We\'ve recieved your response',
			html: `
				<img width="150" src="cid:y&d-logo.png" />
				<h1>Thank you for your response</h1>
				<p>Hi ${name}</p>
				<p>${attending ? attendingMsg : unattendingMsg}</p>
				<br/>
				<p>
				Daryl & Yasmin<br/>
				xx
				</p>
			`,
		};

		return new Promise((resolve, reject) => {
			mg.messages().send(data, function(error, body) {
				if (error) {
					reject(error);
				}
				resolve(body);
			});
		});
	}
}
