import { Request, Response } from "express";
import { promotionsService } from "../services/promotionServices";

export const getPromotionsByStorePK = async (req: Request, res: Response) => {
    try {
        const storePK = req.params.storePK;
        const promotions = await promotionsService.selectPromotionsByStorePK(storePK);
        res.json(promotions);
    } catch (error: any) {
        console.error("Error getting promotions:", error);
        res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
    }
};


export const getPromotionsByStoreIdAndItemCode = async (req: Request, res: Response) => {
    try {
        const storePK = req.params.storeId;
        const itemCode = String(req.params.itemCode);
        if (itemCode=="undefined" || itemCode === "null") {
            throw { status: 400, message: "Invalid itemCode, must be a number" };
        }
        const promotions = await promotionsService.getPromotionsByStoreIdAndItemCode(storePK, itemCode);
        res.json(promotions);
    } catch (error: any) {
        console.error("Error getting promotions:", error);
        res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
    }
};
