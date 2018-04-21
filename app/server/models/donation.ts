import Sequelize, { Model } from 'sequelize';

export default class Donation extends Model {
	static init(sequelizeConnection) {
		super.init({
			message: Sequelize.TEXT,
			amount: Sequelize.INTEGER,
		},
		{
			sequelize: sequelizeConnection,
			timestamps: false,
		});
		return Donation;
	}

	id: string;
	message: string;
	amount: number;
}
