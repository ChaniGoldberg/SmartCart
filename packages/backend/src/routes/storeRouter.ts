import { Router } from "express";
import { storeController } from "../controllers/storeController";


const router=Router();

router.get("/stores", storeController);

export default router;  