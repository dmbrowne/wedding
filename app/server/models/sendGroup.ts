import Sequelize, { Model, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import Attendee from './attendee';
import GalleryImage from './galleryImage';
import EventModel from './event';
import FoodChoice from './foodChoice';

interface GetApplicableSendGroupRecipientVars {
	sendGroups?: SendGroup[];
	sendGroupIds?: SendGroup['id'] | string[];
}

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
					invitationlink: `http://thebrownes.info/invitation/g/${group.id}`,
				},
			};
		}, {});

		return {
			applicableSendees,
			sendAddresses,
			recipientVars,
		};
	}

	static getWithAttendeesAndEvents(id) {
		return this.findById(id, {
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
}
