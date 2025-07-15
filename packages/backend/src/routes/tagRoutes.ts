import { Router } from 'express';
import { addTag, getAllTags, addNewTagsToItems,getItemsWithoutTags } from '../controllers/tagController'; 
const router = Router();

router.get('/tags', getAllTags); 
router.post('/addtag/:tagName', addTag);
router.post('/addtags-to-items', addNewTagsToItems); 
router.get('/items-without-tags', getItemsWithoutTags);

export default router;