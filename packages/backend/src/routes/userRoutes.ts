import { Router } from "express";
import userController from "../controllers/userController";
// import { users } from "../services/userServices";

const router=Router()

router.post("/register",userController.register);
router.post("/updateUser",userController.update);

export default router;