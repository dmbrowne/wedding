import { Router } from 'express';
import * as path from 'path';
import * as multer from 'multer';
import dbModels from '../models';

const upload = multer({ dest: path.join(__dirname, '../../../uploads/') });

const router = Router();

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
