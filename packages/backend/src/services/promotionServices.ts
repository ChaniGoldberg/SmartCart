
import { IPromotions } from "../interfaces/Ipromotions";
import { supabase } from "../services/supabase"; // נשאר כמו שהוא

export const promotionsService: IPromotions = {
  async getPromotionsByStoreId(storePK: string): Promise<typeof db.Promotion> {
    if (!storePK || typeof storePK !== "string") {
      throw { status: 400, message: "Invalid or missing storeId" };
//C:\Users\hp326\Documents\תכנות\Smart-cart\smartcart\packages\backend\src\services\promotionServices.ts

import { IPromotions } from "../interfaces/Ipromotions";
import { db } from "../db/dbProvider";
import { Promotion } from "@smartcart/shared/src/promotion";

 export type PromotionSummary = Pick<Promotion, 'promotionId' | 'promotionDescription' | 'isActive' | 'requiresCoupon'>;

export const promotionsService: IPromotions = {
    async getPromotionsByStoreId(storePK: string): Promise<Promotion[]> {
        if (!storePK || typeof storePK !== "string") {
            throw { status: 400, message: "Invalid or missing storePK" };
    }

    const today = new Date().toISOString();
    const { data, error } = await supabase
      .from("promotion")
      .select("*")
      .eq("store_pk", storePK) // שימוש ישיר במחרוזת
      .lte("start_date", today)
      .gte("end_date", today);

    if (error) {
      console.error("Supabase error:", error.message);
      throw { status: 500, message: "Failed to fetch promotions" };
    }

    return data || [];
  },
  const promotions = db.Promotion.filter((promotion: Promotion) => {
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    return (
      promotion.storePK === storePK &&
      promotion.isActive &&
      start <= today &&
      end >= today
    );
  }).map((promotion: Promotion) => ({
    ...promotion,
    startDate: new Date(promotion.startDate),
    endDate: new Date(promotion.endDate),
    lastUpdated: new Date(promotion.lastUpdated),
  }));

  return promotions;
},

  async getPromotionsByStoreIdAndItemCode(storePK: string, itemCode: number): Promise<PromotionSummary[]> {
    if (!storePK || typeof storePK !== "string") {
      throw { status: 400, message: "Invalid or missing storePK" };
    }
    if (typeof itemCode !== "number") {
      throw { status: 400, message: "Invalid or missing itemCode. Expected a number." };
    }

    const today = new Date();

    const promotions = db.Promotion.filter((promotion: Promotion) => {
      const start = new Date(promotion.startDate);
      const end = new Date(promotion.endDate);

      return (
        promotion.storePK === storePK &&
        promotion.isActive &&
        promotion.promotionItemsCode.includes(itemCode) &&
        start <= today &&
        end >= today
      );
    }).map((promotion: Promotion) => ({
      promotionId: promotion.promotionId,
      promotionDescription: promotion.promotionDescription,
      isActive: promotion.isActive,
      requiresCoupon: promotion.requiresCoupon,
    }));

    return promotions;
  },
};

export default promotionsService;