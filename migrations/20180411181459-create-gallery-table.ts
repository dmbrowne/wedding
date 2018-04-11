import Sequelize, { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return queryInterface.createTable('GalleryImages', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			publicId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			width: Sequelize.INTEGER,
			height: Sequelize.INTEGER,
			format: Sequelize.STRING,
			url: Sequelize.STRING,
			secureUrl: Sequelize.STRING,
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now'),
			},
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.dropTable('GalleryImages');
	},
};