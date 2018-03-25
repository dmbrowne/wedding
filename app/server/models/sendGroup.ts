import Sequelize, { Model } from 'sequelize';

export default class SendGroup extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: Sequelize.STRING,
		},
		{
			tableName: 'SendingGroups',
			sequelize: sequelizeConnection,
		});
		return SendGroup;
	}

	static associate(models) {
		this.hasMany(models.Attendee, { foreignKey: 'sendGroupId' });
	}
}
