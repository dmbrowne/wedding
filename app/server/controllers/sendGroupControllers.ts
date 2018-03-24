import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { NextAppRequest } from '../types';
import models from '../models';
import { getDesiredValuesFromRequestBody, asyncAwaitTryCatch } from '../utils';
import { IAttendee, ISendGroup } from '../types/models';

export async function getAllSendGroups(req: NextAppRequest, res: Response) {
	const sendGroups = await models.SendGroup.findAll();
	res.locals.sendGroups = sendGroups;
	if (req.xhr) {
		res.send(sendGroups);
	} else {
		req.nextAppRenderer.render(req, res, '/sendGroups');
	}
}

export async function getSendGroup(req: NextAppRequest, res: Response) {
	const { sendGroupId } = req.params;
	const sendGroup = await models.SendGroup.findById(sendGroupId);
	const groupAttendees = await sendGroup.getAttendees();
	res.locals.sendGroup = sendGroup;
	res.locals.groupAttendees = groupAttendees;
	if (req.xhr) {
		res.send({sendGroup, groupAttendees});
	} else {
		req.nextAppRenderer.render(req, res, '/sendGroupEdit');
	}
}

const checkAttendeeExistence = (attendeeIds: Array<IAttendee['id']>) => new Promise((resolve, reject) => {
	return models.Attendee.findAll({
		attributes: ['id'],
		where: {
			id: {[Op.or]: attendeeIds },
		},
	})
	.then(attendees => {
		const foundAttendeeIds = attendees.map(({id}) => id);
		const allAttendeesExist = attendeeIds.every(id => foundAttendeeIds.indexOf(id) > -1);
		resolve(allAttendeesExist);
	})
	.catch((err) => reject(err));
});

export async function createSendGroup(req: Request, res: Response) {
	const createAttributes = getDesiredValuesFromRequestBody(['name', 'attendeeIds'], req.body);
	const attendeeIds: string[] | undefined = createAttributes.attendeeIds;
	delete createAttributes.attendeeIds;

	if (attendeeIds) {
		const [err, attendeesExist] = await asyncAwaitTryCatch(checkAttendeeExistence(attendeeIds));
		if (err) {
			res.sendStatus(400).json({ error: err });
		}
		if (!attendeesExist) {
			return res.sendStatus(400).json({ message: 'The provided attendeeIds do not exist'});
		}
	}

	return models.SendGroup.create(createAttributes)
		.then(sendGroup => {
			if (attendeeIds) {
				return sendGroup.setAttendees(attendeeIds).then(() => {
					return res.json({sendGroup});
				});
			}
			return res.json({sendGroup});
		})
		.catch((err) => {
			if (req.xhr) {
				return res.sendStatus(400).send(err);
			}
			return res.redirect('/admin/sendgroups/new?error=undefined');
		});
}

export async function editSendGroup(req: Request, res: Response) {
	const { sendGroupId } = req.params;
	const { name, attendeeIds } = req.body;
	const groupDetails = name ? { name } : null;

	const [err, sendGroup] = await asyncAwaitTryCatch(models.SendGroup.findById(sendGroupId));

	if (err) {
		return res.sendStatus(400).json({ error: err, message: '' });
	}

	if (!sendGroup) {
		return res.sendStatus(400).json({ message: 'Incorrect sendGroupId: A send group with the given id cannot be found' });
	}

	if (groupDetails) {
		await sendGroup.update(groupDetails);
	}

	if (attendeeIds) {
		if (!Array.isArray(attendeeIds) || attendeeIds.length === 0) {
			res.sendStatus(400).json({ message: 'AttendeeIds should be an array of 1 or more attendee.id\'s' });
		}
		const [error, attendeesExist] = await asyncAwaitTryCatch(checkAttendeeExistence(attendeeIds));
		if (error) {
			res.sendStatus(400).json({ error: err });
		}
		if (!attendeesExist) {
			return res.sendStatus(400).json({ message: 'The provided attendeeIds do not exist'});
		}
		const [setAttendeeError] = await asyncAwaitTryCatch(sendGroup.setAttendees(attendeeIds));

		if (setAttendeeError) {
			res.sendStatus(400).json({ error: err });
		}
	}

	return res.send({ sendGroup });
}

export function deleteSendGroup(req: Request, res: Response) {
	const { sendGroupId } = req.params;
	return models.SendGroup.findById(sendGroupId)
		.then(sendGroup => {
			return sendGroup.destroy();
		});
}

export function deleteMultipleSendGroups(req: Request, res: Response) {
	const { sendGroupIds } = req.body;

	if (!sendGroupIds || !Array.isArray(sendGroupIds) || sendGroupIds.length === 0) {
		res.sendStatus(400).json({ message: 'an array of sendGroupIds is required to delete attendee(s)'});
	}

	models.SendGroup.destroy({
		where: {
			id: { [Op.or]: sendGroupIds },
		},
	})
	.then(() => res.send({}))
	.catch(err => {
		console.log(err);
		res.sendStatus(400).send(err);
	});
}
