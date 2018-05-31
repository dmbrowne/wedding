import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { NextAppRequest } from '../types';
import models from '../models';
import { getDesiredValuesFromRequestBody, arrayToObject } from '../utils';
import SendGroup from '../models/sendGroup';
import EventModel from '../models/event';
import FoodChoice, { ChoiceTypes } from '../models/foodChoice';
import BridalPartyRole from '../models/bridalPartyRoles';
import Attendee from '../models/attendee';

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
	bridalParties: { [bridalPartyRoleTypeValue: string]: BridalPartyRole };
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

export async function getNonGroupedAttendees(req, res) {
	return models.Attendee.findAll({
		order: [
			['firstName', 'ASC'],
		],
		where: { sendGroupId: null, email: {[Op.not]: null} },
		include: [{
			model: models.SendGroup,
		}],
	}).then(attendees => {
		res.send(attendees);
	});
}

export async function getAllAttendees(req: NextAppRequest, res: Response) {
	const { search, emailable, grouped } = req.query;

	let attendees;

	if (emailable) {
		attendees = await getEmailableAttendees();
		return res.send(attendees);
	}

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
		attendees = await Attendee.findAll({
			order: [['firstName', 'ASC']],
			include: [{ model: models.SendGroup }],
		});
	}

	res.locals.attendees = attendees;
	if (req.xhr) {
		return res.send(attendees);
	} else {
		return req.nextAppRenderer.render(req, res, '/attendees');
	}
}

export function getEmailableAttendees() {
	return models.Attendee.findAll({
		order: [
			['firstName', 'ASC'],
		],
		where: { email: {[Op.not]: null} },
		include: [{
			model: models.SendGroup,
		}],
	});
}

export function createNewAttendees(req: NextAppRequest, res: Response) {
	if (!req.xhr) {
		res.status(400).send('This resource is only available via XHR');
	}

	const { newAttendees } = req.body;
	const attendees = newAttendees.filter(attendee => !!attendee.firstName);

	if (attendees.length !== newAttendees.length) {
		return res.status(400).send({ message: 'all new attendees require a firstname'});
	}

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

	const attendee = await models.Attendee.findById(attendeeId);

	if (!attendee) {
		if (req.xhr) {
			return res.status(404).json({ message: 'An attendee with the given id cannot be found' });
		}
		res.redirect('/admin/attendees?error=404&type=attendee');
	}

	let updatedAttendee = await attendee.update(req.body);
	if (req.body.eventIds) {
		updatedAttendee = await updatedAttendee.setEvents(req.body.eventIds);
	}
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
		BridalPartyRole.getWithMembers(),
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
			bridalParties: arrayToObject(bridalParties, 'value'),
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
		BridalPartyRole.getWithMembers(),
		Attendee.getAttendeeWtihInvitedEvents(attendeeId),
	])
	.then(([bridalParties, attendee]) => {
		if (!attendee) {
			throw Error(`attendee cannot be found with id ${attendeeId}`);
		}
		const locals: SingleInvitationResponseLocals = {
			invitationId: attendeeId,
			attendee,
			bridalParties: arrayToObject(bridalParties, 'value'),
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
	attendee.sendRsvpConfirmationEmail();
}

export async function groupInvitationRsvpConfirm(req, res) {
	const { rsvp }: { rsvp: Rsvp[] } = req.body;
	const { sendGroupId } = req.params;
	const sendGroup = await SendGroup.findById(sendGroupId);

	if (!sendGroup) {
		return res.status(400).send({ message: `Sendgroup with id ${sendGroupId} does not exist`});
	}

	const attendees = await sendGroup.getAttendees();
	const foodAndEventUpdates = attendees.map(attendee => {
		const attendeeRsvp = rsvp.filter(singleRsvp => singleRsvp.attendeeId === attendee.id)[0];
		if (!attendeeRsvp) {
			throw Error(`attendee ${attendee.id} is not part of the specified send group`);
		}
		return Promise.all([
			(attendeeRsvp.foodChoices ? attendee.selectFood(attendeeRsvp.foodChoices) : Promise.resolve()),
			attendee.updateEventAttendance(models, attendeeRsvp.events),
		]);
	});
	Promise.all(foodAndEventUpdates)
		.then(() => {
			res.send({ success: 'ok' });
			sendGroup.sendRsvpConfirmation();
		})
		.catch(e => { console.log(e); res.status(400).send({ error: e }); });
}
