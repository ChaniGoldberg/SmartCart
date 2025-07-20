import express from "express";
import { getPromotionsByStorePK } from "../controllers/promotionsController";

const router = express.Router();

/**
 * @swagger
 * /api/promotions/by-id/{storeId}:
 *   get:
 *     summary: Get promotions by store ID
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of promotions
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Store not found
 *       500:
 *         description: Server error
 */

router.get("/by-id/:storePK", getPromotionsByStorePK);
export default router;
