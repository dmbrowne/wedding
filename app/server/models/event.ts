import Sequelize, { Model } from 'sequelize';
import Attendee from './attendee';

export default class Event extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: Sequelize.STRING,
			entryTime: Sequelize.DATE,
			startTime: Sequelize.DATE,
			endTime: Sequelize.DATE,
			imageId: Sequelize.UUID,
		},
		{
			sequelize: sequelizeConnection,
		});
		return Event;
	}

	static associate(models) {
		this.belongsToMany(models.Attendee, {
			as: 'Guests',
			through: models.EventAttendee,
			foreignKey: 'eventId',
			onDelete: 'CASCADE',
		});
		this.belongsTo(models.GalleryImage, {
			as: 'featureImage',
			foreignKey: 'imageId',
			onDelete: 'CASCADE',
		});
	}

	id: string;
	name: string;
	description: string;
	entryTime: string;
	startTime: string;
	endTime: string;
	Guests: Attendee[];
}
