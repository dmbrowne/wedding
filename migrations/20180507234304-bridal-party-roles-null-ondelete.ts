import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('BridalParties', 'bridal_party_role_fk');
		await queryInterface.addConstraint('BridalParties', ['partyRoleId'], {
			type: 'foreign key',
			name: 'bridal_party_role_fk',
			onDelete: 'SET NULL',
			references: {
				table: 'BridalPartyRoles',
				field: 'id',
			},
		});
		await queryInterface.removeConstraint('BridalParties', 'bridal_party_image_fk');
		await queryInterface.addConstraint('BridalParties', ['imageId'], {
			type: 'foreign key',
			name: 'bridal_party_image_fk',
			onDelete: 'SET NULL',
			references: {
				table: 'GalleryImages',
				field: 'id',
			},
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeConstraint('BridalParties', 'bridal_party_role_fk');
		await queryInterface.addConstraint('BridalParties', ['partyRoleId'], {
			type: 'foreign key',
			name: 'bridal_party_role_fk',
			onDelete: 'CASCADE',
			references: {
				table: 'BridalPartyRoles',
				field: 'id',
			},
		});
		await queryInterface.removeConstraint('BridalParties', 'bridal_party_image_fk');
		await queryInterface.addConstraint('BridalParties', ['imageId'], {
			type: 'foreign key',
			name: 'bridal_party_image_fk',
			onDelete: 'CASCADE',
			references: {
				table: 'GalleryImages',
				field: 'id',
			},
		});
	},
};
