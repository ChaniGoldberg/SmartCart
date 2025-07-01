import express from "express";
import { getPromotionsBySuperId } from "../controller/promotionsController";

const router = express.Router();
/**
 * @swagger
 * /api/promotions/by-store/{storeName}:
 *   get:
 *     summary: Get promotions by store name
 *     parameters:
 *       - in: path
 *         name: storeName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of promotions
 *       500:
 *         description: Server error
 */
router.get("/by-store/:storeName", getPromotionsBySuperId);
export default router;


