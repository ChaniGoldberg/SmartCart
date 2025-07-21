import { Router } from "express";
import { searchStoreController } from "../controllers/searchStoreController";


const router=Router();

router.get('/stores', searchStoreController); 

export default router; 