import { Request, Response } from "express";
import promotionsService from "../services/promotionServices";

export const getPromotionsByStorePK = async (req: Request, res: Response) => {
    try {
        const storePK = req.params.storePK;
        const promotions = await promotionsService.getPromotionsByStorePK(storePK);
        res.json(promotions);
    } catch (error: any) {
        console.error("Error getting promotions:", error);
        res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
    }
};

