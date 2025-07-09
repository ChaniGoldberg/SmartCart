import { Router } from 'express';
import { addTag, getAllTags } from '../controllers/tagController';

const router = Router();
router.get('/tags', getAllTags);
router.post('/addtag', addTag);

export default router;
