import { Router } from 'express';
import { addTag, getAllTags, addNewTagsToItems } from '../controllers/tagController'; 
const router = Router();

router.get('/tags', getAllTags); 
router.post('/addtag/:tagName', addTag);
router.post('/addtags-to-items', addNewTagsToItems); 

export default router;