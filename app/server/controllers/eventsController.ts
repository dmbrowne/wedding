import { Request, Response, NextFunction } from 'express';
import models from '../models';
import { NextAppRequest } from '../types';
import { getDesiredValuesFromRequestBody } from '../utils';

export function getAllEvents(req: NextAppRequest, res: Response) {
	models.Event.findAll({
		include: [{
			model: models.GalleryImage,
			as: 'featureImage',
		}],
	}).then(events => {
		if (req.xhr) {
			res.send(events);
			return;
		}
		res.locals.events = events;
		req.nextAppRenderer.render(req, res, '/events');
		return;
	});
}

export function getEvent(req: NextAppRequest, res: Response) {
	const { eventId } = req.params;
	models.Event.findById(eventId, {
		include: [{
			model: models.GalleryImage,
			as: 'featureImage',
		}],
	}).then(event => {
		if (req.xhr) {
			res.send(event);
			return;
		}
		res.locals.event = event;
		req.nextAppRenderer.render(req, res, '/eventEdit');
		return;
	});
}

export function createEvent(req: NextAppRequest, res: Response) {
	const eventDetails = getDesiredValuesFromRequestBody([
		'name',
		'slug',
		'description',
		'startTime',
		'endTime',
		'entryTime',
		'imageId',
	], req.body);

	if (!eventDetails.name) {
		(req.xhr ?
			res.status(400).json({ message: 'Name of event is required' }) :
			res.redirect('/admin/events/new')
		);
	}
	models.Event.create(eventDetails)
		.then(event => (req.xhr ?
			res.send(event) :
			res.redirect('/admin/events')
		))
		.catch(err => (req.xhr ?
			res.status(400).json({ erorr: err }) :
			res.redirect('/admin/events/new')
		));
}

export function editEvent(req: NextAppRequest, res: Response) {
	const { eventId } = req.params;
	const eventDetails = getDesiredValuesFromRequestBody([
		'name',
		'slug',
		'description',
		'startTime',
		'endTime',
		'entryTime',
		'imageId',
	], req.body);

	if (!eventDetails) {
		(req.xhr ?
			res.send({}) :
			res.redirect('/admin/events'));
	}
	models.Event.findById(eventId).then(event => {
		if (!event) {
			return (req.xhr ?
				res.status(400).json({ message: 'event does not exist' }) :
				res.redirect(`/admin/events/${eventId}`));
		}
		event.update(eventDetails).then(evnt => {
			(req.xhr ?
				res.send(evnt) :
				res.redirect('/admin/events'));
		});
	});
}

export function deleteEvent(req: NextAppRequest, res: Response) {
	const { eventId } = req.params;

	models.Event.findById(eventId).then(event => {
		if (!event) {
			return (req.xhr ?
				res.status(400).json({ message: 'event does not exist' }) :
				res.redirect(`/admin/events`));
		}
		event.destroy().then(() => {
			(req.xhr ?
				res.send({}) :
				res.redirect('/admin/events'));
		});
	});
}

export function getEventAttendees(req: NextAppRequest, res: Response, next: NextFunction) {
	const { eventId } = req.params;

	models.Event.findById(eventId, {
		include: [{
			model: models.Attendee,
			as: 'Guests',
		}],
	}).then(event => {
		if (req.xhr) {
			res.send(event);
			return;
		}
		res.locals.event = event;
		req.nextAppRenderer.render(req, res, '/eventAttendees');
		return;
	})
	.catch(err => next(err));
}

const addOrRemoveGuestsSanityCheck = (req: Request) => new Promise((resolve, reject) => {
	const { eventId } = req.params;
	let { attendeeIds } = req.body;
	attendeeIds = Array.isArray(attendeeIds) && attendeeIds.length ? attendeeIds : null;

	if (!attendeeIds) {
		return reject({ code: 400, message: 'attendeeIds are required' });
	}

	return models.Event.findById(eventId).then(event => {
		if (!event) {
			return reject({ code: 400, message: 'event does not exist' });
		}
		return resolve({event, attendeeIds});
	});
});

export function setEventAttendees(req: Request, res: Response) {
	addOrRemoveGuestsSanityCheck(req)
	.then(({event, attendeeIds}) => {
			if (event) {
				event.setGuests(attendeeIds)
					.then(() => res.send({}))
					.catch(err => {
						res.status(400).json({ error: err });
					});
			}
		})
		.catch(({ code, message }) => {
			res.status(code).json({ message });
		});
}
