import User from './user';
import Attendee from './attendee';
import Event from './event';
import EventAttendee from './eventAttendee';
import SeatingTable from './seatingTable';
import SendGroup from './sendGroup';
import Campaign from './campaign';
import CampaignAttendee from './campaignAttendee';
import CampaignSendGroup from './campaignAttendeeGroup';
import GalleryImage from './galleryImage';
import BridalParty from './bridalParty';
import BridalPartyRoles from './bridalPartyRoles';
import FoodChoice from './foodChoice';
import Donation from './donation';
import EmailTemplate from './emailTemplate';
import sequelizeConnection from './lib/connection';

interface IModels {
  User: typeof User;
  Attendee: typeof Attendee;
  Event: typeof Event;
  EventAttendee: typeof EventAttendee;
  SeatingTable: typeof SeatingTable;
  SendGroup: typeof SendGroup;
  Campaign: typeof Campaign;
  CampaignAttendee: typeof CampaignAttendee;
  CampaignSendGroup: typeof CampaignSendGroup;
  GalleryImage: typeof GalleryImage;
  BridalParty: typeof BridalParty;
  BridalPartyRoles: typeof BridalPartyRoles;
  FoodChoice: typeof FoodChoice;
  Donation: typeof Donation;
  EmailTemplate: typeof EmailTemplate;
}

const modelz = [
  User,
  Attendee,
  BridalParty,
  Event,
  EventAttendee,
  BridalPartyRoles,
  SeatingTable,
  SendGroup,
  Campaign,
  CampaignAttendee,
  CampaignSendGroup,
  GalleryImage,
  FoodChoice,
  Donation,
  EmailTemplate,
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
