import { Promotion } from "@smartcart/shared";

export interface IPromotionRepository {
  addPromotion(promotion: Promotion): Promise<Promotion>;
  addManyPromotions(promotions: Promotion[]): Promise<Promotion[]>;
  updatePromotion(promotion: Promotion): Promise<Promotion>;
  updateManyPromotions(promotions: Promotion[]): Promise<Promotion[]>;
  getAllPromotions(): Promise<Promotion[]>;
  getPromotionById(promotionId: number): Promise<Promotion | null>;
  SelectPromotionsByStorePK(storePK: string): Promise<Promotion[]>;
  getPromotionsByStorePK(storePK: string): Promise<Promotion[]>;
  deletePromotionById(promotionId: number): Promise<void>;

  // --- חדש: פונקציות לניהול קישורי Promotion-Item ---
  // אלה הפונקציות שהכי הגיוני שיהיו כאן, כי המבצע "מכיל" פריטים.
  linkItemToPromotion(promotionId: number, itemCode: string): Promise<void>;
  unlinkItemFromPromotion(promotionId: number, itemCode: string): Promise<void>;
  getItemsByPromotionId(promotionId: number): Promise<string[]>; // מחזיר רק את ה-itemCode
  setItemsForPromotion(promotionId: number, itemCodes: string[]): Promise<void>;

  // אופציונלי: פונקציה לשלוף את הפריטים המלאים עבור מבצע
  // getFullItemsByPromotionId(promotionId: number): Promise<Item[]>;
}