export interface IGalleryImage {
	id?: string;
	publicId: string;
	width: number;
	height: number;
	format: string;
	url: string;
	secureUrl: string;
	squareImage: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUser {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	id: string;
	role: 'admin' | 'user';
}
export interface IAttendee {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	tableId: string;
	sendGroupId: string;
	Table?: ITable | null;
	SendGroup?: ISendGroup | null;
	Events?: IEvent[] | null;
}

export interface IBridesmaid {
	id: string;
	bio: string;
	lastName: string;
	firstName: string;
	photoUrl: string;
	maidOfHonour: boolean;
}

export interface IEvent {
	id: string;
	name: string;
	slug: string;
	description: string;
	entryTime: Date;
	startTime: Date;
	endTime: Date;
	dietFeedback: boolean;
	imageId: string;
	Guests?: IAttendee[] | null;
	featureImage?: IGalleryImage;
}

export interface IEventAttendee {
	eventId: string;
	attendeeId: string;
	attending: boolean;
}

export interface IGroomsmen {
	id: string;
	bio: string;
	lastName: string;
	firstName: string;
	photoUrl: string;
	bestman: boolean;
}

export interface ITable {
	id: string;
	name: string;
	TableGuests?: IAttendee[] | null;
}

export interface ISendGroup {
	id: string;
	name: string;
	email: string;
	Attendees?: IAttendee[] | null;
}

export interface ICampaign {
	id?: string;
	name: string;
	content?: string;
	subject?: string;
	groupCampaign?: boolean;
}
