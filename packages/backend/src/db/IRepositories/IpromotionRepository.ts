import { Promotion } from "../../../../shared/src/promotion";

export interface IPromotionRepository {
  addPromotion(promotion: Promotion): Promise<Promotion>;
  addManyPromotions(promotions: Promotion[]): Promise<Promotion[]>;
  updatePromotion(promotion: Promotion): Promise<Promotion>;
  updateManyPromotions(promotions: Promotion[]): Promise<Promotion[]>;
  getAllPromotions(): Promise<Promotion[]>;
  getPromotionById(promotionId: number): Promise<Promotion | null>;
  getPromotionsByStorePK(storePK: string): Promise<Promotion[]>;
  deletePromotionById(promotionId: number): Promise<void>;

  // --- חדש: פונקציות לניהול קישורי Promotion-Item ---
  // אלה הפונקציות שהכי הגיוני שיהיו כאן, כי המבצע "מכיל" פריטים.
  linkItemToPromotion(promotionId: number, itemCode: number): Promise<void>;
  unlinkItemFromPromotion(promotionId: number, itemCode: number): Promise<void>;
  getItemsByPromotionId(promotionId: number): Promise<number[]>; // מחזיר רק את ה-itemCode
  setItemsForPromotion(promotionId: number, itemCodes: number[]): Promise<void>;

  // אופציונלי: פונקציה לשלוף את הפריטים המלאים עבור מבצע
  // getFullItemsByPromotionId(promotionId: number): Promise<Item[]>;
}