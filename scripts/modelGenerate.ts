import * as fs from 'fs';
import * as path from 'path';
import * as clc from 'cli-color';
import * as _ from 'lodash';
import * as beautify from 'js-beautify';
import helpers from '../node_modules/sequelize-cli/lib/helpers';

const [fileName] = process.argv.slice(2);

if (!fileName) {
	throw Error('Filename for migrations file not given');
}

helpers.init.createMigrationsFolder();

const template = fs.readFileSync(path.resolve(__dirname, '..', 'config', 'migrationTemplate.ts')).toString();
const content = beautify(
	_.template(template)({}),
	{
		indent_with_tabs: true,
		indent_size: 2,
		preserve_newlines: true,
	},
);

let filePath = helpers.path.getMigrationPath(fileName).split('.');
filePath.pop();
filePath.join();
filePath = filePath + '.ts';

fs.writeFileSync(
	filePath,
	content,
);

helpers.view.log(
	'New migration was created at',
	clc.blueBright(filePath),
	'.',
);

process.exit(0);
