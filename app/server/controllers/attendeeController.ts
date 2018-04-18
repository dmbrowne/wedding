import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { NextAppRequest } from '../types';
import models from '../models';
import { getDesiredValuesFromRequestBody, objectToArray } from '../utils';
import SendGroup from '../models/sendGroup';
import EventModel from '../models/event';
// import GalleryImage from '../models/galleryImage';
import FoodChoice, { ChoiceTypes } from '../models/foodChoice';
import BridalPartyRoles from '../models/bridalPartyRoles';
import Attendee from '../models/attendee';
import BridalParty from '../models/bridalParty';

interface Rsvp {
	attendeeId: string;
	email: string;
	events: {
		[eventId: string]: boolean;
	};
	foodChoices?: {
		starter: ChoiceTypes;
		main: ChoiceTypes;
		allergies: string;
	};
}

// type ResponseLocals = Response['locals'];
interface IniviteResponseLocals {
	bridalParties: { [bridalId: string]: BridalParty };
	allInvitedEvents: EventModel[];
}

export interface SingleInvitationResponseLocals extends IniviteResponseLocals {
	invitationId: Attendee['id'];
	attendee: Attendee;
	singleInvitation: true;
}

export interface GroupInvitationResponseLocals extends IniviteResponseLocals {
	invitationId: SendGroup['id'];
	sendGroup: SendGroup;
	singleInvitation?: false;
}

export async function getAllAttendees(req: NextAppRequest, res: Response, next) {
	const { search, emailable } = req.query;

	if (emailable) {
		return getEmailableAttendees(req, res, next);
	}

	let attendees;

	if (search) {
		const searchTerms = decodeURIComponent(search).split(',').filter(term => term).map(term => `%${term}%`);
		const columnsToSearch = ['firstName', 'lastName', 'email'];
		const whereOrQuery = columnsToSearch.map(columnName => ({
			[columnName]: {
				[Op.iLike]: { [Op.any]: searchTerms },
			},
		}));

		attendees = await models.Attendee.findAll({
			where: { [Op.or]: whereOrQuery },
			include: [{
				model: models.SendGroup,
			}],
		});
	} else {
		attendees = await models.Attendee.findAll();
	}

	res.locals.attendees = attendees;
	if (req.xhr) {
		res.send(attendees);
	} else {
		req.nextAppRenderer.render(req, res, '/attendees');
	}
}

export function getEmailableAttendees(req, res, next) {
	models.Attendee.findAll({
		where: { email: {[Op.not]: null} },
		include: [{
			model: models.SendGroup,
		}]
	})
	.then(attendees => res.send(attendees))
	.catch(e => {
		console.log(e);
		next(e);
	});
}

export async function getAttendee(req: NextAppRequest, res: Response) {
	const { attendeeId } = req.params;
	const attendee = await models.Attendee.findById(attendeeId, { include: [{ model: FoodChoice }]});
	res.locals.attendee = attendee;
	if (req.xhr) {
		res.send(attendee);
	} else {
		req.nextAppRenderer.render(req, res, '/attendeeEdit');
	}
}

export function createNewAttendees(req: NextAppRequest, res: Response) {
	if (!req.xhr) {
		res.status(400).send('This resource is only available via XHR');
	}

	const { newAttendees } = req.body;
	const attendees = newAttendees.filter(attendee => !!attendee.firstName && !!attendee.lastName);

	return bulkCreateWithAssociations(attendees)
		.then(() => res.json({success: true}))
		.catch((err) => {
			res.status(400).send(err);
		});

	function bulkCreateWithAssociations(attndees) {
		const bulkCreation = attndees.map(attendee => {
			return models.Attendee.create({
				firstName: attendee.firstName,
				lastName: attendee.lastName,
				email: attendee.email || null,
			})
			.then((createdAttendee): Promise<any> => {
				if (!attendee.eventIds) {
					return Promise.resolve(createdAttendee);
				}
				return createdAttendee.setEvents(attendee.eventIds);
			});
		});
		return Promise.all(bulkCreation);
	}
}

export async function editAttendee(req: NextAppRequest, res: Response) {
	const { attendeeId } = req.params;
	const updateValues = getDesiredValuesFromRequestBody(['email', 'firstName', 'lastName'], req.body);

	if (!updateValues) {
		res.redirect(`/admin/attendees/${attendeeId}`);
	}

	const attendee = await models.Attendee.findById(attendeeId);

	if (!attendee) {
		if (req.xhr) {
			return res.status(404).json({ message: 'An attendee with the given id cannot be found' });
		}
		res.redirect('/admin/attendees?error=404&type=attendee');
	}

	await attendee.update(updateValues);
	const updatedAttendee = await models.Attendee.findById(attendeeId);
	if (req.xhr) {
		return res.send(updatedAttendee);
	}
	return res.redirect('/admin/attendees');
}

function deleteMultipleAttendees(req: Request, res: Response) {
	const { attendeeIds } = req.body;

	if (!attendeeIds || !Array.isArray(attendeeIds) || attendeeIds.length === 0) {
		res.status(400).json({ message: 'an array of attendeeIds is required to delete attendee(s)'});
	}

	models.Attendee.destroy({
		where: {
			id: { [Op.or]: attendeeIds },
		},
	})
	.then(() => res.send({}))
	.catch(err => {
		console.log(err)
		res.status(400).send(err);
	});
}

export function deleteAttendee(req: NextAppRequest, res: Response, next: NextFunction) {
	if (req.xhr) {
		return deleteMultipleAttendees(req, res);
	}

	const { attendeeId } = req.params;
	models.Attendee.findById(attendeeId).then(attendee => {
		return attendee.destroy();
	})
	.then(() => res.redirect('/admin/attendees'))
	.catch(err => next(err));
}

export function getGroupInvitation(req: NextAppRequest, res: Response, next: NextFunction) {
	const { sendGroupId } = req.params;
	Promise.all([
		BridalPartyRoles.getWithMembers(),
		SendGroup.getWithAttendeesAndEvents(sendGroupId),
	])
	.then(([bridalParties, sendGroup]) => {
		if (!sendGroup) {
			res.status(400);
			throw Error(`sendGroup cannot be found with id ${sendGroupId}`);
		}

		const mergedEvents = sendGroup.mergeEventsForSendGroupAttendees().sort((a, b) => {
			return new Date(a.startTime) > new Date(b.startTime) ? 1 : 0;
		});
		const locals: GroupInvitationResponseLocals = {
			invitationId: sendGroupId,
			sendGroup,
			bridalParties: objectToArray(bridalParties, 'value'),
			allInvitedEvents: mergedEvents.sort((a, b) => new Date(a.startTime) > new Date(b.startTime) ? 1 : 0),
			singleInvitation: false,
		};

		res.locals = { ...res.locals, ...locals };
		return req.nextAppRenderer.render(req, res, '/invitation');
	})
	.catch(err => next(err));
}

export function getSingleInvitation(req: NextAppRequest, res: Response, next: NextFunction) {
	const { attendeeId } = req.params;
	Promise.all([
		BridalPartyRoles.getWithMembers(),
		Attendee.getAttendeeWtihInvitedEvents(attendeeId),
	])
	.then(([bridalParties, attendee]) => {
		if (!attendee) {
			throw Error(`attendee cannot be found with id ${attendeeId}`);
		}
		const locals: SingleInvitationResponseLocals = {
			invitationId: attendeeId,
			attendee,
			bridalParties: objectToArray(bridalParties, 'value'),
			allInvitedEvents: attendee.Events,
			singleInvitation: true,
		};
		res.locals = { ...res.locals, ...locals };
		return req.nextAppRenderer.render(req, res, '/invitation');
	})
	.catch(err => {
		next(err);
	});
}

export async function singleInvitationRsvpConfirm(req, res) {
	const { rsvp }: { rsvp: Rsvp } = req.body;
	const { attendeeId } = req.params;
	const attendee = await Attendee.findById(attendeeId).catch(e => res.status(400).send({ error: e }));
	if (!attendee) {
		return res.status(400).send({ message: `Attendee with id ${attendeeId} does not exist`});
	}
	await Promise.all([
		rsvp.foodChoices ? attendee.selectFood(rsvp.foodChoices) : Promise.resolve(),
		attendee.updateEventAttendance(models, rsvp.events),
	])
	.catch(e => res.status(400).send({ error: e }));
	res.send({ success: 'ok' });
}

export async function groupInvitationRsvpConfirm(req, res) {
	const { rsvp }: { rsvp: Rsvp[] } = req.body;
	const { sendGroupId } = req.params;
	const sendGroup = await SendGroup.findById(sendGroupId).catch(e => res.status(400).send({ error: e }));

	if (!sendGroup) {
		return res.status(400).send({ message: `Sendgroup with id ${sendGroupId} does not exist`});
	}

	await sendGroup.getAttendees().then(attendees => Promise.all(
		attendees.map(attendee => {
			const attendeeRsvp = rsvp.filter(singleRsvp => singleRsvp.attendeeId === attendee.id)[0];
			if (!attendeeRsvp) {
				throw Error(`attendee ${attendee.id} is not part of the specified send group`);
			}
			return Promise.all([
				(attendeeRsvp.foodChoices ? attendee.selectFood(attendeeRsvp.foodChoices) : Promise.resolve()),
				attendee.updateEventAttendance(models, attendeeRsvp.events),
			]);
		}),
	))
	.catch(e => res.status(400).send({ error: e }));
	res.send({ success: 'ok' });
}
