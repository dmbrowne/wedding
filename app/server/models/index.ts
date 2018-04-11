import User from './user';
import Attendee from './attendee';
import Bridesmaid from './bridesmaid';
import Event from './event';
import EventAttendee from './eventAttendee';
import Groomsmen from './groomsmen';
import SeatingTable from './seatingTable';
import SendGroup from './sendGroup';
import Campaign from './campaign';
import CampaignAttendee from './campaignAttendee';
import CampaignAttendeeGroup from './campaignAttendeeGroup';
import GalleryImage from './galleryImage';
import sequelizeConnection from './lib/connection';

interface IModels {
  User: typeof User;
  Attendee: typeof Attendee;
  Bridesmaid: typeof Bridesmaid;
  Event: typeof Event;
  EventAttendee: typeof EventAttendee;
  Groomsmen: typeof Groomsmen;
  SeatingTable: typeof SeatingTable;
  SendGroup: typeof SendGroup;
  Campaign: typeof Campaign;
  CampaignAttendee: typeof CampaignAttendee;
  CampaignAttendeeGroup: typeof CampaignAttendeeGroup;
  GalleryImage: typeof GalleryImage;
}

const modelz = [
  User,
  Attendee,
  Bridesmaid,
  Event,
  EventAttendee,
  Groomsmen,
  SeatingTable,
  SendGroup,
  Campaign,
  CampaignAttendee,
  CampaignAttendeeGroup,
  GalleryImage,
];

const dbModels = modelz.reduce((models, ModelClass) => {
  ModelClass.init(sequelizeConnection);
  if (models[ModelClass.name]) {
    return models;
  }
  return {
    ...models,
    [ModelClass.name]: ModelClass,
  };
}, {}) as IModels;

modelz.forEach((ModelClass: any) => {
  if (ModelClass.associate) {
    ModelClass.associate(dbModels);
  }
});

export { sequelizeConnection as sequelize };
export default dbModels;
