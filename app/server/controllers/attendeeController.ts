import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { NextAppRequest } from '../types';
import models from '../models';
import { getDesiredValuesFromRequestBody } from '../utils';
import SendGroupModel from '../models/sendGroup';
import GalleryImage from '../models/galleryImage';
import FoodChoice, { ChoiceTypes } from '../models/foodChoice';
import BridalPartyRoles from '../models/bridalPartyRoles';

interface Rsvp {
	attendeeId: string;
	email: string;
	events: {
		[eventId: string]: boolean;
	};
	diet?: {
		starter: ChoiceTypes;
		main: ChoiceTypes;
	};
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
		models.SendGroup.findById(sendGroupId, {
			include: [{
				model: models.Attendee,
				include: [{
						model: models.Event,
						as: 'Events',
						include: [{
							model: GalleryImage,
							as: 'featureImage',
						}],
				}],
			}],
		}),
	])
	.then(([bridalParties, sendGroup]) => {
		if (!sendGroup) {
			res.status(404);
			throw Error(`sendGroup cannot be found with id ${sendGroupId}`);
		}

		const mergedEvents = sendGroup.Attendees.reduce((sendGroupsOtherAttendeesEvents, attendee) => {
			const attendeeEvents = attendee.Events.reduce((events, event) => {
				delete event.Attendees;
				return {
					...events,
					[event.id]: event,
				};
			}, {});

			return {
				...sendGroupsOtherAttendeesEvents,
				...attendeeEvents,
			};
		}, {});

		const sendGroupAttendees = sendGroup.Attendees.map(attendee => ({
			...attendee.toJSON(),
			dietFeedbackRequired: attendee.Events.some(event => event.dietFeedback),
		}));

		res.locals.bridalParties = bridalParties.reduce((parties, party) => ({
			...parties,
			[party.value]: party,
		}), {});
		req.session.invitationId = sendGroupId;
		res.locals.sendGroup = {...sendGroup.toJSON(), Attendees: sendGroupAttendees };
		res.locals.singleInvitation = false;
		res.locals.services = Object.keys(mergedEvents)
			.map(eventId => mergedEvents[eventId])
			.sort((a, b) => new Date(a.startTime) > new Date(b.startTime) ? 1 : 0);
		return req.nextAppRenderer.render(req, res, '/invitation');
	})
	.catch(err => {
		next(err);
	});
}

export function getSingleInvitation(req: NextAppRequest, res: Response, next: NextFunction) {
	const { attendeeId } = req.params;
	Promise.all([
		BridalPartyRoles.getWithMembers(),
		models.Attendee.findById(attendeeId, {
			include: [{
				model: models.Event,
				as: 'Events',
				include: [{
					model: GalleryImage,
					as: 'featureImage',
				}],
			}, {
				model: FoodChoice,
			}],
		}),
	])
	.then(([bridalParties, attendee]) => {
		if (!attendee) {
			throw Error(`attendee cannot be found with id ${attendeeId}`);
			req.session.invitationId = attendeeId;
		}
		res.locals.attendee = {
			...attendee.toJSON(),
			dietFeedbackRequired: attendee.Events.some(event => event.dietFeedback),
		};
		res.locals.bridalParties = bridalParties.reduce((parties, party) => ({
			...parties,
			[party.value]: party,
		}), {});
		res.locals.services = attendee.Events.sort((a, b) => new Date(a.startTime) > new Date(b.startTime) ? 1 : 0);
		res.locals.singleInvitation = true;
		return req.nextAppRenderer.render(req, res, '/invitation');
	})
	.catch(err => {
		next(err);
	});
}

const updateSendGroupRsvps = (sendGroup: SendGroupModel, rsvps: Rsvp[]) => {
	return sendGroup.getAttendees().then(attendees => Promise.all(
		attendees.map(attendee => {
			const attendeeRsvp = rsvps.filter(rsvp => rsvp.attendeeId === attendee.id)[0];
			if (!attendeeRsvp) {
				throw Error(`attendee ${attendee.id} is not part of the specified send group`);
			}
			const selectFoodPromise = (attendeeRsvp.diet ?
				attendee.selectFood(attendeeRsvp.diet) :
				Promise.resolve()
			);

			return selectFoodPromise
				.then(() => attendee.updateEventAttendance(models, attendeeRsvp.events));
		}),
	));
};

export function rsvpConfirm(req: Request, res: Response, next: NextFunction) {
	const attendeeRsvps: Rsvp[] | Rsvp = req.body.attendeeRsvps;
	const { invitationId } = req.params;
	// const { invitationId: sessionInvitationId } = req.session;

	// if (invitationId !== sessionInvitationId) {
	// 	return res.status(401).json({ message: 'This user doesn\'t have permission to modify this RSVP' });
	// }

	const rsvpIsForAGroup = Array.isArray(attendeeRsvps);
	const dbModel = rsvpIsForAGroup ? models.SendGroup : models.Attendee;
	const entityType = rsvpIsForAGroup ? 'SendGroup' : 'Attendee';

	dbModel.findById(invitationId)
		.then((result) => {
			if (!result) {
				return res.status(404).json({ message: `A ${entityType} with the invitationId provided does not exist`});
			}

			const updateAttendance = rsvpIsForAGroup ?
				updateSendGroupRsvps(result, attendeeRsvps as Rsvp[]) :
				Promise.all([
					attendeeRsvps.diet ? result.selectFood(attendeeRsvps.diet) : Promise.resolve(),
					result.updateEventAttendance(models, attendeeRsvps.events),
				]);

			return updateAttendance
			.then(() => {
				res.send({ success: 'ok' });
				delete req.session.invitationId;
			})
			.catch(err => {
				res.status(400).json({ message: err.message });
			});
		})
		.catch(err => {
			res.status(500);
			next(err);
		});
}

export function makeFoodChoices(req, res) {
	const { starter, main } = req.body;
	models.Attendee.find()
}
