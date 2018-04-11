import { Router } from 'express';
import * as path from 'path';
import { verifyUser } from '../utils/express';
import * as multer from 'multer';

const upload = multer({ dest: path.join(__dirname, '../../../uploads/') });

const router = Router();

router.use(verifyUser);

router.post('/', upload.single('image'), (req, res) => {
	const { file } = req;
	console.log('file ===============================');
	console.log(file);
	console.log('file ===============================');
	res.send({ success: 'ok'});
});

export default router;
