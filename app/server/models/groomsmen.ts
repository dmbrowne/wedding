import Sequelize, { Model } from 'sequelize';

export interface IGroomsmen {
	bio: string;
	lastName: string;
	firstName: string;
	photoUrl: string;
	bestman: boolean;
}

export default class Groomsmen extends Model {
	static init(sequelizeConnection) {
		super.init({
			bio: Sequelize.STRING,
			firstName: Sequelize.STRING,
			lastName: Sequelize.STRING,
			photoUrl: Sequelize.STRING,
			bestman: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			sequelize: sequelizeConnection,
		});
		return Groomsmen;
	}
}
