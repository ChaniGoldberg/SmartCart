import { Promotion } from "@smartcart/shared";

export interface IPromotionRepository {
   linkItemToPromotion(promotionId: number, itemCode: string): Promise<void> ;
    unlinkItemFromPromotion(promotionId: number, itemCode: string): Promise<void> ;
     getPromotionsByStoreIdAndItemCode(storePK: string, itemCode: string): Promise<Promotion[]> ;
     setItemsForPromotion(promotionId: number, itemCodes: string[]): Promise<void> ;
     addPromotion(promotion: Promotion): Promise<Promotion> 
     addManyPromotions(promotions: Promotion[]): Promise<Promotion[]> ;
     updatePromotion(promotion: Promotion): Promise<Promotion> ;
     updateManyPromotions(promotions: Promotion[]): Promise<Promotion[]> ;
     upsertManyPromotions(promotions: Promotion[]): Promise<void> ;
     getAllPromotions(): Promise<Promotion[]> ;
     getPromotionById(promotionId: number): Promise<Promotion | null> ;
     SelectPromotionsByStorePK(storePK: string): Promise<Promotion[]> ;
     getPromotionsByStorePK(storePK: string): Promise<Promotion[]> ;
     deletePromotionById(promotionId: number): Promise<void> ;
     getItemsByPromotionId(promotionId: number): Promise<string[]> ;

  // אופציונלי: פונקציה לשלוף את הפריטים המלאים עבור מבצע
  // getFullItemsByPromotionId(promotionId: number): Promise<Item[]>;
}