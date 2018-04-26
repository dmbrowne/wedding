import Sequelize, { Model, HasManyGetAssociationsMixin, HasManySetAssociationsMixin } from 'sequelize';
import Attendee from './attendee';
import GalleryImage from './galleryImage';
import EventModel from './event';
import FoodChoice from './foodChoice';
import * as path from 'path';
import mg, { variables as mailGunVariables } from './lib/mailgun';

const { from } = mailGunVariables;

interface GetApplicableSendGroupRecipientVars {
	sendGroups?: SendGroup[];
	sendGroupIds?: SendGroup['id'] | string[];
}

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://thebrownes.info' : 'http://localhost:4000';
export const invitationUrlPrefix = `${baseUrl}/invitation/g`;

export default class SendGroup extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: Sequelize.STRING,
			email: Sequelize.STRING,
		},
		{
			sequelize: sequelizeConnection,
		});
		return SendGroup;
	}

	static associate(models) {
		this.hasMany(models.Attendee, { foreignKey: 'sendGroupId', onDelete: 'CASCADE' });
		this.belongsToMany(models.Campaign, {
			through: models.CampaignSendGroup,
			foreignKey: 'sendGroupId',
			onDelete: 'CASCADE',
		});
	}

	static async getApplicableRecipientVars(options: GetApplicableSendGroupRecipientVars) {
		if (!options.sendGroupIds && !options.sendGroups) {
			throw Error('sendGroups or sendGroupsId required');
		}

		let { sendGroups } = options;
		const { sendGroupIds } = options;

		if (sendGroupIds) {
			sendGroups = await this.findAll({
				where: {
					id: sendGroupIds,
					email: !null,
				},
			});
		}
		const applicableSendees = sendGroupIds ? sendGroups : sendGroups.filter(group => group.getDataValue('email'));
		const sendAddresses = applicableSendees.map(group => group.getDataValue('email'));
		const recipientVars = applicableSendees.reduce((accum, group) => {
			return {
				...accum,
				[group.getDataValue('email')]: {
					name: group.name,
					invitationlink: SendGroup.invitationUrl(group.id),
				},
			};
		}, {});

		return {
			applicableSendees,
			sendAddresses,
			recipientVars,
		};
	}

	static invitationUrl = (sendGroup) => invitationUrlPrefix + '/' + sendGroup;

	static getWithAttendeesAndEvents(id) {
		return this.findById(id, {
			order: [
				[Attendee, { model: EventModel, as: 'Events' }, 'startTime', 'ASC'],
			],
			include: [{
				model: Attendee,
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
			}],
		});
	}

	id: string;
	name: string;
	email: string;
	Attendees: Attendee[];
	getAttendees: HasManyGetAssociationsMixin<Attendee>;
	setAttendees: HasManySetAssociationsMixin<Attendee, 'id'>;

	mergeEventsForSendGroupAttendees() {
		interface MergedEvents {
			[eventId: string]: EventModel;
		}

		const mergedEventsKeyedByEventId: MergedEvents = this.Attendees.reduce((sendGroupsOtherAttendeesEvents, attendee) => {
			const attendeeEvents = attendee.Events.reduce((events, event) => {
				return {
					...events,
					[event.id]: event,
				};
			}, {});

			return {
				...sendGroupsOtherAttendeesEvents,
				...attendeeEvents,
			};
		}, {});
		return Object.keys(mergedEventsKeyedByEventId).map(eventId => mergedEventsKeyedByEventId[eventId]).sort((a, b) => {
			return new Date(a.startTime) > new Date(b.startTime) ? 1 : 0;
		});
	}

	async sendRsvpConfirmation() {
		const filename = path.join(__dirname, '../../client/assets/y&d-logo.png');
		const attendees = await this.getAttendees({
			order: [['sendGroupOrder', 'ASC']],
			include: [{
				model: EventModel,
			}],
		}).catch(e => console.log('ERRRORRR!!!', e));
		const { present: attending, unAttending: notAttending } = attendees.reduce((accum, attendee) => {
			let {unAttending, present} = accum;
			const attendingEvents = attendee.Events.filter(event => event.EventAttendee.attending);
			if (attendingEvents.length > 0) {
				present = [...present, attendee.getDataValue('firstName')];
			} else {
				unAttending = [...unAttending, attendee.getDataValue('firstName')];
			}
			return {
				unAttending,
				present,
			};
		}, {present: [], unAttending: []});

		const [attendingNames, notAttendingNames] = [attending, notAttending].map(attndees => {
			return [
				attndees.slice(0, -1).join(', '),
				attndees.slice(-1)[0],
			]
			.join(attndees.length < 2 ? '' : ' and ');
		});
		const attendingMsg = attending.length ? `
<p>Hi ${attendingNames}</p>
<p>We\'re really happy that you\'ll be attending, We can\'t wait to see you on the day</p>
` : '';
		const unattendingMsg = notAttending.length ? `
<p>Hey ${notAttendingNames}</p>
<p>Sorry you can\'t share our big day with us, however we hope to see you soon</p>
` : '';
		const data = {
			inline: filename,
			to: this.getDataValue('email'),
			from: `Mr and Mrs Browne <${from}>`,
			subject: 'Thank you for your response',
			html: `
<img width="150" src="cid:y&d-logo.png" />
<h1>Thank you for your response</h1>
${attendingMsg}
${attendingMsg && unattendingMsg ? '<br/><br/>' : ''}
${unattendingMsg}
<br/>
<p>
Daryl & Yasmin<br />
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
