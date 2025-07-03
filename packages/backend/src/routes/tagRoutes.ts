import { Router } from 'express';
import { addTag } from '../controllers/tagController';

const router = Router();

router.post('/addtag', addTag);

export default router;
