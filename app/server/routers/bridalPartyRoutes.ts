import { Router, Request, Response, NextFunction } from 'express';
import { verifyUser, xhrOnly } from '../utils/express';
import BridalParty from '../models/bridalParty';
import BridalPartyRole from '../models/bridalPartyRoles';
import { asyncAwaitTryCatch } from '../utils';

interface RequestWithBridalParty extends Request {
	bridalPartyMember: BridalParty;
}

const router = Router();

router.use(verifyUser);

router.route('/')
	.get(async (req, res, next) => {
		if (req.xhr) {
			next();
		}
		const bridalParties = await BridalParty.getAllBridalParties();
		res.locals.bridalParties = bridalParties;
		req.nextAppRenderer.render(req, res, '/bridalParties');
	})
	.get(async (req, res, next) => {
		const bridalParties = await BridalParty.getAllBridalParties();
		res.send(bridalParties);
	})
	.post((req, res) => {
		const { bridalPartyInput } = req.body;
		BridalParty.create(bridalPartyInput)
			.then(bridalPartyMember => res.send(bridalPartyMember))
			.catch(e => res.status(400).json({ error: e }));
	})
	.delete(xhrOnly, async (req, res) => {
		const { bridalPartyIds } = req.body;
		await BridalParty.deleteBridalPartiesById(bridalPartyIds);
		res.send({ success: 'ok' });
	});

router.route('/roles')
	.get(xhrOnly, (_, res) => {
		BridalPartyRole.findAll()
			.then(roles => res.send(roles))
			.catch(e => res.status(400).send({ error: e }));
	})
	.post(xhrOnly, (req, res) => {
		const { newRoleInput } = req.body;
		BridalPartyRole.create(newRoleInput)
			.then(role => res.send(role))
			.catch(e => res.status(400).send({ error: e }));
	})
	.delete(xhrOnly, (req, res) => {
		const { bridalRoleIds } = req.body;
		BridalPartyRole.deleteByIds(bridalRoleIds)
			.then(() => res.send({ success: 'ok' }))
			.catch(e => res.status(400).send({ error: e }));
	});

router.route('/:bridalPartyId')
	.all(async (req: RequestWithBridalParty) => {
		const bridalPartyMember = await BridalParty.getById(req.params.bridalPartyId);
		req.bridalPartyMember = bridalPartyMember;
	})
	.get(async (req: RequestWithBridalParty, res: Response, next: NextFunction) => {
		if (req.xhr) {
			next();
		}
		res.locals.bridalParty = req.bridalPartyMember;
		req.nextAppRenderer.render(req, res, '/bridalParties');
	})
	.get((req: RequestWithBridalParty, res) => {
		res.send(req.bridalPartyMember);
	})
	.put(xhrOnly, async (req: RequestWithBridalParty, res) => {
		const { updateBridalPartyInput } = req.body;
		const [err, updatedMember] = await asyncAwaitTryCatch(req.bridalPartyMember.update(updateBridalPartyInput));
		if (err) {
			return res.status(400).send({error: err});
		}
		return res.send(updatedMember);
	})
	.delete(xhrOnly, (req: RequestWithBridalParty, res) => {
		req.bridalPartyMember.destroy()
			.then(() => res.send({ success: 'ok' }))
			.catch(e => res.status(400).send({ error: e }));
	});

export default router;
