import Sequelize, { Model } from 'sequelize';

export default class Bridesmaid extends Model {
	static init(sequelizeConnection) {
		super.init({
			bio: Sequelize.STRING,
			firstName: Sequelize.STRING,
			lastName: Sequelize.STRING,
			photoUrl: Sequelize.STRING,
			maidOfHonour: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			sequelize: sequelizeConnection,
		});
		return Bridesmaid;
	}
}
