import { Router, Request, Response, NextFunction } from 'express';
import { verifyUser, xhrOnly } from '../utils/express';
import BridalParty from '../models/bridalParty';
import BridalPartyRole from '../models/bridalPartyRoles';
import { asyncAwaitTryCatch } from '../utils';
import dbModels from '../models';

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
		dbModels.BridalParty.create(bridalPartyInput)
			.then(bridalPartyMember => res.send(bridalPartyMember))
			.catch(e => res.status(400).json({ error: e }));
	})
	.delete(xhrOnly, async (req, res) => {
		const { bridalPartyIds } = req.body;
		await BridalParty.deleteBridalPartiesById(bridalPartyIds);
		res.send({ success: 'ok' });
	});

router.get('/new', async (req, res) => {
	res.locals.bridalPartyRoles = await BridalPartyRole.findAll();
	req.nextAppRenderer.render(req, res, '/bridalPartyCreate');
});

router.route('/roles')
	.get(xhrOnly, async (req, res) => {
		const promise = (req.query.includeMembers ?
			BridalPartyRole.getWithMembers() :
			BridalPartyRole.findAll()
		);
		promise
			.then(roles => res.send(roles))
			.catch(err => res.status(400).send({ error: err }));
	})
	.post(xhrOnly, (req, res) => {
		const { bridalPartyRoleInput } = req.body;
		BridalPartyRole.create(bridalPartyRoleInput)
		.then(role => res.send(role))
		.catch(e => res.status(400).send({ error: e }));
	})
	.delete(xhrOnly, (req, res) => {
		const { bridalRoleIds } = req.body;
		BridalPartyRole.deleteByIds(bridalRoleIds)
		.then(() => res.send({ success: 'ok' }))
		.catch(e => res.status(400).send({ error: e }));
	});

router.put('/roles/:roleId', [xhrOnly,
	async (req, res) => {
		const role = await BridalPartyRole.findById(req.params.roleId);
		const updatedRole = await role.update(req.body.bridalPartyRoleUpdateInput);
		res.send(updatedRole);
	},
]);

router.route('/:bridalPartyId')
	.all(async (req: RequestWithBridalParty, res, next) => {
		const bridalPartyMember = await BridalParty.getById(req.params.bridalPartyId);
		req.bridalPartyMember = bridalPartyMember;
		next();
	})
	.get(async (req: RequestWithBridalParty, res: Response, next: NextFunction) => {
		if (req.xhr) {
			next();
		}
		res.locals.bridalParty = req.bridalPartyMember;
		res.locals.bridalPartyRoles = await BridalPartyRole.findAll();
		req.nextAppRenderer.render(req, res, '/bridalPartyCreate');
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
