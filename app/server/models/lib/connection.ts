import { Sequelize } from 'sequelize';
const databaseConfig = require('../../../../config/database.json');
const config = databaseConfig[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
