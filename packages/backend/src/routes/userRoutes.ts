import { Router } from "express";
import userController from "../controllers/userController";
// import { users } from "../services/userServices";

const router=Router()

router.post("/register",userController.register);

export default router;