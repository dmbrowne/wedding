import Sequelize, { Model } from 'sequelize';

export default class Event extends Model {
	static init(sequelizeConnection) {
    super.init({
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: Sequelize.STRING,
      startTime: Sequelize.DATE,
      endTime: Sequelize.DATE,
    },
    {
      sequelize: sequelizeConnection,
		});
    return Event;
  }
}
