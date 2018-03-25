export interface IAttendee {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
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
	description: string;
	startTime: Date;
	endTime: Date;
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
}

export interface ISendGroup {
	id: string;
	name: string;
	email: string;
}
