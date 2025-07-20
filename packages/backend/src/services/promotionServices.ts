import { IPromotions } from "../interfaces/Ipromotions";
import { supabase } from "../services/supabase"; // נשאר כמו שהוא
import { Promotion } from "@smartcart/shared/src/promotion";

export type PromotionSummary = Pick<Promotion, 'promotionId' | 'promotionDescription' | 'isActive' | 'requiresCoupon'>;

export const promotionsService: IPromotions = {
  // פונקציה לקבלת פרומושנים לפי מזהה סניף
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

  // פונקציה לקבלת פרומושנים לפי מזהה סניף ומזהה מוצר
  async getPromotionsByStoreIdAndItemCode(storePK: string, itemCode: number): Promise<PromotionSummary[]> {
    if (!storePK || typeof storePK !== "string") {
      throw { status: 400, message: "Invalid or missing storePK" };
    }
    if (typeof itemCode !== "number") {
      throw { status: 400, message: "Invalid or missing itemCode. Expected a number." };
    }

    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from("promotion")
      .select("*")
      .eq("store_pk", storePK)
      .eq("promotion_items_code", itemCode)
      .lte("start_date", today)
      .gte("end_date", today);

    if (error) {
      console.error("Supabase error:", error.message);
      throw { status: 500, message: "Failed to fetch promotions" };
    }

    const promotions = data.map((promotion: Promotion) => ({
      promotionId: promotion.promotionId,
      promotionDescription: promotion.promotionDescription,
      isActive: promotion.isActive,
      requiresCoupon: promotion.requiresCoupon,
    }));

    return promotions;
  },
};
  
export default promotionsService;
