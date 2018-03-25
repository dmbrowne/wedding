import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { NextAppRequest } from '../types';
import models from '../models';
import { getDesiredValuesFromRequestBody } from '../utils';

export async function getAllAttendees(req: NextAppRequest, res: Response) {
	const attendees = await models.Attendee.findAll();
	res.locals.attendees = attendees;
	if (req.xhr) {
		res.send(attendees);
	} else {
		req.nextAppRenderer.render(req, res, '/attendees');
	}
}

export async function getAttendee(req: NextAppRequest, res: Response) {
	const { attendeeId } = req.params;
	const attendee = await models.Attendee.findById(attendeeId);
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

	return models.Attendee.bulkCreate(attendees)
		.then(() => res.json({success: true}))
		.catch((err) => {
			res.status(400).send(err);
		});
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
