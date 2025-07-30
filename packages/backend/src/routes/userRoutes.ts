import { Router } from "express";
import userController from "../controllers/userController";
import { authenticate } from "../authenticate";
// import { users } from "../services/userServices";

const router=Router()

router.post("/register",userController.register);
router.put("/updateUser",authenticate, userController.update);
router.get('/me', authenticate, userController.getMe);

router.post("/login",userController.login);
export default router;