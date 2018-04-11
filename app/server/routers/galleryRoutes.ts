import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as multer from 'multer';
import dbModels from '../models';
import GalleryImage from '../models/galleryImage';

const upload = multer({ dest: path.join(__dirname, '../../../uploads/') });

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
	dbModels.GalleryImage.findAll()
		.then((galleryImages: GalleryImage[]) => {
			if (req.xhr) {
				res.send(galleryImages);
				return;
			}
			res.locals.galleryImages = galleryImages;
			req.nextAppRenderer.render(req, res, '/gallery');
			return;
		})
		.catch(e => next(e));
});

router.post('/', upload.single('image'), (req, res, next) => {
	dbModels.GalleryImage.addNewImage(req.file.path)
		.then((result) => {
			res.send({ result });
		})
		.catch(e => {
			next(e);
		});
});

router.delete('/:galleryImageId', (req, res, next) => {
	dbModels.GalleryImage.findById(req.params.galleryImageId)
		.then(galleryImage => galleryImage.delete())
		.then(() => res.send({ deleted: true }))
		.catch(e => next(e));
});

export default router;
