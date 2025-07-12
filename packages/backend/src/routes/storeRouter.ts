import { Router } from "express";
import { storeController,addStoreController } from "../controllers/storeController";


const router=Router();

router.get("/getStores", storeController);
router.post("/addstore", addStoreController); // Assuming you want to handle POST requests as well

export default router;  
