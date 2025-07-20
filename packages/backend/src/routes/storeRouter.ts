import { Router } from "express";
import { storeController } from "../controllers/storeController";


const router=Router();

router.get("/", storeController);


export default router;  
