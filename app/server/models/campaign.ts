import Sequelize, { Model } from 'sequelize';
import Attendee from './attendee';
import SendGroup from './sendGroup';

interface CreateCampaignOptions {
	name: string;
	subject?: string;
	content?: string;
	groupCampaign?: boolean;
}

export default class Campaign extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			subjecr: Sequelize.STRING,
			content: Sequelize.TEXT,
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
		this.belongsToMany(models.Attendee, { through: models.CampaignAttendee, foreignKey: 'attendeeId', onDelete: 'CASCADE' });
		this.belongsToMany(models.SendGroup, { through: models.CampaignAttendeeGroup, foreignKey: 'sendGroupId', onDelete: 'CASCADE' });
	}

	static createCampaign(options: CreateCampaignOptions) {
		return this.create(options);
	}

	static getAllCampaigns() {
		return this.findAll({
			include: [{
				model: Attendee,
			}],
		});
	}

	static getCampaign(id: string) {
		return this.findById(id, {
			include: [{
				model: Attendee,
			}],
		});
	}

	addAttendeesToCampaign(attendeeIds: Array<Attendee['id']>) {
		return this.setAttendees(attendeeIds);
	}

	addSendGroupsToCampaign(sendGroupIds: Array<SendGroup['id']>) {
		return this.setSendGroups(sendGroupIds);
	}
}
