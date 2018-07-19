import Sequelize, { Model } from 'sequelize';
import draftToHtml from 'draftjs-to-html';

interface EmailTemplateAttributes {
	name: string;
	draftContentState?: string;
}

export default class EmailTemplate extends Model {
	static init(sequelizeConnection) {
		super.init({
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			draftContentState: Sequelize.TEXT,
		},
		{
			sequelize: sequelizeConnection,
		});
		return EmailTemplate;
	}

	static getHtml(contentState) {
		return draftToHtml(JSON.parse(contentState));
	}

	readonly id: string;
	name: string;
	draftContentState?: string;

	getHtml() {
		return draftToHtml(JSON.parse(this.draftContentState));
	}
}
