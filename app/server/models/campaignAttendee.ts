import Sequelize, { Model } from 'sequelize';

export default class CampaignAttendee extends Model {
	static init(sequelizeConnection) {
		super.init({
			campaignId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			attendeeId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
		},
		{
			sequelize: sequelizeConnection,
		});
		return CampaignAttendee;
	}
}
