import { Sequelize } from 'sequelize';
import User from './user';
import Attendee from './attendee';
import Bridesmaid from './bridesmaid';
import Event from './event';
import EventAttendee from './eventAttendee';
import Groomsmen from './groomsmen';
import SeatingTable from './seatingTable';

// tslint:disable-next-line
const databaseConfig = require('../../../config/database.json');
const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

interface IModels {
  User: typeof User;
  Attendee: typeof Attendee;
  Bridesmaid: typeof Bridesmaid;
  Event: typeof Event;
  EventAttendee: typeof EventAttendee;
  Groomsmen: typeof Groomsmen;
  SeatingTable: typeof SeatingTable;
}

interface ISequelize extends Sequelize {
  models: IModels;
}

const sequelize = new Sequelize(config.database, config.username, config.password, config) as ISequelize;

const modelz = [
  User,
  Attendee,
  Bridesmaid,
  Event,
  EventAttendee,
  Groomsmen,
  SeatingTable,
];

modelz.forEach(ModelClass => {
  ModelClass.init(sequelize);
  if (!sequelize.models[ModelClass.name]) {
    sequelize.models[ModelClass.name] = ModelClass;
  }
});
modelz.forEach((ModelClass: any) => {
  if (ModelClass.associate) {
    ModelClass.associate(sequelize.models);
  }
});

export function authenticate() {
  return sequelize.authenticate().then(() => sequelize);
}

const models = sequelize.models;

export default models;
