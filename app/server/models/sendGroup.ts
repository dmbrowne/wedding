import Sequelize, { Model } from 'sequelize';

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
					invitationlink: `http://thebrownes.info/g/${group.id}`,
				},
			};
		}, {});

		return {
			applicableSendees,
			sendAddresses,
			recipientVars,
		};
	}

	id: string;
	name: string;
	email: string;
}
