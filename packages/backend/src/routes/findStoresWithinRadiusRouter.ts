import { Router } from "express";
import { getStoresWithinRadiusController } from "../controllers/findStoresWithinRadiusController";

const router=Router();
debugger
console.log("❤️❤️❤️❤️");

router.get("/withLocationAndRadius/:latitude/:longitude/:radius", getStoresWithinRadiusController);
export default router;