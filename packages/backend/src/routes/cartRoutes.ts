import { Router } from "express";
import {compareCart } from "../controllers/cartController";
import { compare } from "bcrypt";
const router=Router()

router.post("/compare",compareCart); 

export default router;