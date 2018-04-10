import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import Sequelize, { Model } from 'sequelize';

export default class User extends Model {
	static rawAttributes = {
		// http://krmannix.com/2017/05/23/postgres-autogenerated-uuids-with-sequelize/
		// An extension is required to allow postgress to set UUIDV$ as a default, defining the
		// defaultValue in the model is a workaround
		username: {
			type: Sequelize.STRING,
			unique: true,
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
		},
		password: {
			type: Sequelize.STRING,
		},
		firstName: {
			type: Sequelize.STRING,
		},
		lastName: {
			type: Sequelize.STRING,
		},
		role: {
			type: Sequelize.ENUM('admin', 'user'),
			allowNull: false,
			defaultValue: 'user',
		},
	};

	static init(sequelizeConnection) {
		super.init(this.rawAttributes, {
			sequelize: sequelizeConnection,
			hooks: {
				beforeCreate: this.beforeCreate,
				beforeBulkCreate: this.beforeBulkCreate,
			},
			defaultScope: {
				attributes: { exclude: ['password'] },
			},
			scopes: {
				allFields: {
					attributes: {
						include: Object.keys(this.rawAttributes),
					},
				},
			},
		});
		return User;
	}

	static hashUserPassword(user): Promise<any> {
		return bcryptHash(user.getDataValue('password'), 10).then(hash => {
			user.setDataValue('password', hash);
			return user;
		});
	}

	static beforeCreate(user): Promise<any> {
		return this.hashUserPassword(user);
	}

	static beforeBulkCreate(users): Promise<any> {
		return Promise.all(users.map(user => this.hashUserPassword(user)));
	}

	password: string;

	checkPassword(plainTextPassword): Promise<boolean> {
		return bcryptCompare(plainTextPassword, this.password);
	}
}
