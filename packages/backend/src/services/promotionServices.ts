import { PromotionRepository } from "../db/Repositories/promotionRepository";
import { IPromotions } from "../interfaces/Ipromotions";
import { supabase } from "../services/supabase"; // נשאר כמו שהוא
import { Promotion } from "@smartcart/shared";

export type PromotionSummary = Pick<Promotion, 'promotionId' | 'promotionDescription' | 'isActive' | 'requiresCoupon'>;

const promotionRepository = new PromotionRepository(supabase);
export const promotionsService: IPromotions = {
  async selectPromotionsByStorePK(storePK: string): Promise<Promotion[]> {
    return await promotionRepository.SelectPromotionsByStorePK(storePK);
  },

  
  // פונקציה לקבלת פרומושנים לפי מזהה סניף ומזהה מוצר
  async getPromotionsByStoreIdAndItemCode(storePK: string, itemCode: string): Promise<PromotionSummary[]> {
    if (!storePK || typeof storePK !== "string") {
      throw { status: 400, message: "Invalid or missing storePK" };
    }
    if (typeof itemCode !== "string") {
      throw { status: 400, message: "Invalid or missing itemCode. Expected a string." };
    }
  
    const today = new Date().toISOString();
  
    // 1. קבל את כל המבצעים החלים בחנות בטווח תאריכים
    const { data: promotions, error: promotionsError } = await supabase
      .from("promotion")
      .select("*")
      .eq("store_pk", storePK)
      .lte("start_date", today)
      .gte("end_date", today);
  
    if (promotionsError || !promotions) {
      console.error("Supabase error:", promotionsError?.message);
      throw { status: 500, message: "Failed to fetch promotions" };
    }
  
    // 2. קבל את כל רשומות הקישור של פריטי מבצעים בטבלה promotion_items
    const promotionIds = promotions.map(p => p.promotion_id);
  
    const { data: promotionItems, error: promotionItemsError } = await supabase
      .from("promotion_items")
      .select("promotion_id, item_code")
      .in("promotion_id", promotionIds)
      .eq("item_code", itemCode);
  
    if (promotionItemsError) {
      console.error("Supabase error:", promotionItemsError.message);
      throw { status: 500, message: "Failed to fetch promotion items" };
    }
  
    const matchedPromotionIds = new Set(promotionItems.map(pi => pi.promotion_id));
  
    // 3. סנן את המבצעים שיש להם את הפריט המבוקש
    const filteredPromotions = promotions.filter(p => matchedPromotionIds.has(p.promotion_id));
  
    // 4. החזר את התוצאות בפורמט הרצוי
    return filteredPromotions.map(promotion => ({
      promotionId: promotion.promotion_id,
      promotionDescription: promotion.promotion_description,
      isActive: promotion.is_active,
      requiresCoupon: promotion.requires_coupon,
    }));
  }
}  
  
export default promotionsService;
