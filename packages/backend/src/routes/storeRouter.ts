import { Router } from "express";
import { storeController,addStoreController } from "../controllers/storeController";


const router=Router();

router.get("/getStores", storeController);


export default router;  
