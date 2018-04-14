import { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return Promise.all([
			queryInterface.addConstraint('BridalParties', ['partyRoleId'], {
				type: 'foreign key',
				name: 'bridal_party_role_fk',
				onDelete: 'CASCADE',
				references: {
					table: 'BridalPartyRoles',
					field: 'id',
				},
			}),
			queryInterface.addConstraint('BridalParties', ['imageId'], {
				type: 'foreign key',
				name: 'bridal_party_image_fk',
				onDelete: 'CASCADE',
				references: {
					table: 'GalleryImages',
					field: 'id',
				},
			}),
		]);
	},

	down: (queryInterface: QueryInterface) => {
		return Promise.all([
			queryInterface.removeConstraint('BridalParties', 'bridal_party_role_fk'),
			queryInterface.removeConstraint('BridalParties', 'bridal_party_image_fk'),
		]);
	},
};