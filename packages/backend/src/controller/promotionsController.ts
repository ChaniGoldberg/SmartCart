import { Request, Response } from "express";
import promotionsService from "../services/promotionServices";

export const getPromotionsBySuperId = async (req: Request, res: Response) => {
  try {
    
    const storeName = req.params.storeName;
    const promotions = await promotionsService.promotionsBySuperId(storeName);
    res.json(promotions);
  } catch (error) {
    console.error("Error getting promotions:", error);
    res.status(500).json({ error: "Failed to get promotions" });
  }
};
