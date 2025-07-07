import { Request, Response } from "express";
import promotionsService from "../services/promotionServices";

export const getPromotionsByStoreId = async (req: Request, res: Response) => {
    try {
        const storeId = parseInt(req.params.storeId, 10);
        const promotions = await promotionsService.getPromotionsByStoreId(storeId);
        res.json(promotions);
    } catch (error: any) {
        console.error("Error getting promotions:", error);
        res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
    }
};

