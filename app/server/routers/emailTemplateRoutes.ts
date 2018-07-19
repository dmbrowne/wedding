import { Router, Request } from 'express';
import { xhrOnly, verifyUser } from '../utils/express';
import EmailTemplate from '../models/emailTemplate';

interface RequestWithEmailTemplate extends Request {
	emailTemplate: EmailTemplate;
}

const router = Router();

router.use(verifyUser);

router
	.route('/')
	.get(async (req, res) => {
		const emailTemplates = await EmailTemplate.findAll();
		if (req.xhr) {
			res.send(emailTemplates);
			return;
		}
		res.locals.emailTemplates = emailTemplates;
		req.nextAppRenderer.render(req, res, '/emailTemplates');
	})
	.post(async (req, res) => {
		const { name, draftContentState } = req.body;
		try {
			const emailTemplate = await EmailTemplate.create({ name, draftContentState });
			res.send(emailTemplate);
		} catch (e) {
			res.status(400).send(e);
		}
	});

router
	.route('/:emailTemplateId')
	.all(async (req: RequestWithEmailTemplate, _, next) => {
		const emailTemplate = await EmailTemplate.findById(req.params.emailTemplateId);
		req.emailTemplate = emailTemplate;
		next();
	})
	.get((req: RequestWithEmailTemplate, res) => {
		res.locals.emailTemplate = req.emailTemplate;
		req.nextAppRenderer.render(req, res, '/emailTemplateEdit');
	})
	.put((req: RequestWithEmailTemplate, res) => {
		const { emailTemplate, body } = req;

		emailTemplate.update({
			...body.name ? { name: body.name } : {},
			...body.draftContentState ? {
				draftContentState: JSON.stringify(body.draftContentState) } :
				{},
		})
		.then(result => {
			res.send({result});
		});
	})
	.delete(xhrOnly, (req: RequestWithEmailTemplate, res) => {
		req.emailTemplate.destroy().then(result => {
			res.send({result});
		});
	});

export default router;
