import Sequelize, {
	Model,
	BelongsToManyCreateAssociationMixin,
	BelongsToManySetAssociationsMixin,
	BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import draftToHtml from 'draftjs-to-html';
import mg, { variables as mailGunVariables } from './lib/mailgun';
import * as path from 'path';
import Attendee from './attendee';
import SendGroup from './sendGroup';

interface CreateCampaignOptions {
	name: string;
	subject?: string;
	content?: string;
	groupCampaign?: boolean;
}

const { from } = mailGunVariables;

export default class Campaign extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			subject: Sequelize.STRING,
			content: {
				type: Sequelize.TEXT,
			},
			groupCampaign: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
		},
		{
			sequelize: sequelizeConnection,
		});
		return Campaign;
	}

	static associate(models) {
		this.belongsToMany(models.Attendee, { through: models.CampaignAttendee, foreignKey: 'campaignId', onDelete: 'CASCADE' });
		this.belongsToMany(models.SendGroup, { through: models.CampaignSendGroup, foreignKey: 'campaignId', onDelete: 'CASCADE' });
	}

	static createCampaign(options: CreateCampaignOptions) {
		return this.create(options);
	}

	static getAllCampaigns() {
		return this.findAll({
			include: [{
				model: SendGroup,
			}, {
				model: Attendee,
			}],
		});
	}

	static getCampaign(id: string) {
		return this.findById(id, {
			include: [{
				model: SendGroup,
			}, {
				model: Attendee,
			}],
		});
	}

	static bulkSendBothGroupAndSingleEmailCampaigns = async (campaignIds: string[]) => {
		interface CategorisedCampaigns {
			sendGroupCampaigns: Campaign[];
			singleAttendeeCampaigns: Campaign[];
		}

		const campaigns: Campaign[] = await Campaign.findAll({ where: { id: campaignIds } });
		const categorisedCampaigns: CategorisedCampaigns = {
			sendGroupCampaigns: [],
			singleAttendeeCampaigns: [],
		};

		const { sendGroupCampaigns, singleAttendeeCampaigns } = campaigns.reduce((accum, campaign) => {
			const key = !!campaign.groupCampaign ? 'sendGroupCampaigns' : 'singleAttendeeCampaigns';
			return {
				...accum,
				[key]: [
					...accum[key],
					campaign,
				],
			};
		}, categorisedCampaigns);

		const sendResult = [
			...sendGroupCampaigns ? await Campaign.bulkSendGroupedCampaigns(sendGroupCampaigns) : [],
			...singleAttendeeCampaigns ? await Campaign.bulkAttendeeCampaigns(singleAttendeeCampaigns) : [],
		];
		return sendResult;
	}

	static bulkSendGroupedCampaigns(sendGroupCampaigns: Array<(Campaign | string)>) {
		const allRecipientVarsPromise = Promise.all(sendGroupCampaigns.map((campaignIdOrCampaign) => {
			const getCampaignDao = (typeof campaignIdOrCampaign === 'string' ?
				new Promise(resolve => {Campaign.findById(campaignIdOrCampaign).then(campaign => resolve(campaign)); }) :
				Promise.resolve(campaignIdOrCampaign)
			);
			return getCampaignDao.then((campaign: Campaign) => {
				return campaign.getSendGroups()
					.then(sendGroups => {
						return SendGroup.getApplicableRecipientVars({sendGroups});
					})
					.then(recipientVars => ({
						campaign,
						recipientVars,
					}));
			});
		}));

		return allRecipientVarsPromise.then(allRecipientVars => {
			return Promise.all(allRecipientVars.map(({ campaign, recipientVars }) => {
				return this.sendMail(campaign, recipientVars);
			}));
		});
	}

	static bulkAttendeeCampaigns(singleCampaigns: Array<(Campaign | string)>) {
		const allRecipientVarsPromise = Promise.all(singleCampaigns.map((campaignIdOrCampaign) => {
			const getCampaignDao = (typeof campaignIdOrCampaign === 'string' ?
				new Promise(resolve => {Campaign.findById(campaignIdOrCampaign).then(campaign => resolve(campaign)); }) :
				Promise.resolve(campaignIdOrCampaign)
			);
			return getCampaignDao.then((campaign: Campaign) => {
				return campaign.getAttendees()
					.then(attendees => {
						return Attendee.getApplicableRecipientVars({attendees});
					})
					.then(recipientVars => ({
						campaign,
						recipientVars,
					}));
			});
		}));

		return allRecipientVarsPromise.then(allRecipientVars => {
			return Promise.all(allRecipientVars.map(({ campaign, recipientVars }) => {
				return this.sendMail(campaign, recipientVars);
			}));
		});
	}

	static sendMail(campaign, recipientVariables) {
		const filename = path.join(__dirname, '../../client/assets/y&d-logo.png');
		const { sendAddresses, recipientVars } = recipientVariables;
		const { subject, content } = campaign;
		let html = draftToHtml(JSON.parse(content));
		html = html.replace('%logo%', '<img width="150" src="cid:y&d-logo.png"/>');

		const data = {
			'inline': filename,
			'to': sendAddresses,
			'from': `Dazza Youoo <${from}>`,
			'subject': subject,
			'recipient-variables': recipientVars,
			'html': html,
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

	id: string;
	name: string;
	subject?: string;
	content?: string;
	groupCampaign?: boolean;
	Attendees: Attendee[];
	getAttendees: BelongsToManyGetAssociationsMixin<Attendee>;
	setAttendees: BelongsToManySetAssociationsMixin<Attendee, Attendee['id']>;
	SendGroups: SendGroup[];
	getSendGroups: BelongsToManyGetAssociationsMixin<SendGroup>;
	setSendGroups: BelongsToManySetAssociationsMixin<SendGroup, SendGroup['id']>;

	addAttendeesToCampaign(attendeeIds: Array<Attendee['id']>) {
		return this.setAttendees(attendeeIds);
	}

	addSendGroupsToCampaign(sendGroupIds: Array<SendGroup['id']>) {
		return this.setSendGroups(sendGroupIds);
	}
}
