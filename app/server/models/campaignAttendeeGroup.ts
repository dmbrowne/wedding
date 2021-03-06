import Sequelize, { Model } from 'sequelize';

export default class CampaignSendGroup extends Model {
	static init(sequelizeConnection) {
		super.init({
			campaignId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			sendGroupId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
		},
		{
			sequelize: sequelizeConnection,
			timestamps: false,
		});
		return CampaignSendGroup;
	}
}
