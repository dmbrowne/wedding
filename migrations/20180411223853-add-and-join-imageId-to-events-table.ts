import Sequelize, {
	QueryInterface
} from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addColumn('Events', 'imageId', {
			type: Sequelize.UUID,
		});
		await queryInterface.addConstraint('Events', ['imageId'], {
			type: 'foreign key',
			name: 'event_imageId_fk',
			onDelete: 'CASCADE',
			references: {
				table: 'GalleryImages',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('Events', 'event_imageId_fk');
		await queryInterface.removeColumn('Events', 'imageId');
	},
};
