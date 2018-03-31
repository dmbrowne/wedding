import Sequelize, { Model } from 'sequelize';

export default class Campaign extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
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
		this.belongsToMany(models.Attendee, { through: models.CampaignAttendee, foreignKey: 'attendeeId' });
		this.belongsToMany(models.SendGroup, { through: models.CampaignAttendeeGroup, foreignKey: 'sendGroupId' });
	}
}
