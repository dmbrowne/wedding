import { Router, Request, Response, NextFunction } from 'express';
import {} from '../controllers/userController';
import { verifyUser, xhrOnly } from '../utils/express';
import Campaign from '../models/campaign';
import { Op } from 'sequelize';

interface RequestWithCampaign extends Request {
	campaign?: Campaign;
}

const router = Router();

router.use(verifyUser);

router.route('/')
	.get(async (req: Request, res: Response, next: NextFunction) => {
		if (req.xhr) { next(); }
		const campaigns = await Campaign.getAllCampaigns();
		res.locals.campaigns = campaigns;
		req.nextAppRenderer.render(req, res, '/campaigns');
	})
	.get(async (_, res: Response) => {
		const campaigns = await Campaign.getAllCampaigns();
		res.send(campaigns);
	})
	.post(xhrOnly, async (req: Request, res: Response) => {
		const { campaign } = req.body;
		const newCampaign = await Campaign.createCampaign(campaign);
		res.send(newCampaign);
	})
	.delete(xhrOnly, (req: Request, res: Response, next: NextFunction) => {
		const { campaignIds } = req.body;
		Campaign.destroy({ where: { id: { [Op.or]: campaignIds } } })
			.then(() => res.send({ success: 'ok' }))
			.catch(e => {
				next(e);
			});
	});

router.route('/:campaignId')
	.all(async (req: RequestWithCampaign, _, next: NextFunction) => {
		const campaign = await Campaign.getCampaign(req.params.campaignId);
		req.campaign = campaign;
		next();
	})
	.get(async (req: RequestWithCampaign, res: Response, next: NextFunction) => {
		if (req.xhr) { next(); }
		res.locals.campaign = req.campaign;
		req.nextAppRenderer.render(req, res, '/campaignEdit');
	})
	.get(async (req: RequestWithCampaign, res: Response) => {
		res.send(req.campaign);
	})
	.put(async (req: RequestWithCampaign, res: Response) => {
		const { campaignInput, attendeeIds } = req.body;
		const updatedCampaign = await req.campaign.update(campaignInput);
		if (attendeeIds) {
			await updatedCampaign.addAttendeesToCampaign(attendeeIds);
		}
		res.send({ success: 'ok' });
	})
	.delete((req: RequestWithCampaign, res: Response) => {
		req.campaign.destroy().then(() => {
			res.send({ success: 'ok' });
		});
	});

export default router;
