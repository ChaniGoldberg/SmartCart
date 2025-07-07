import { IDB } from "../db/IDB"; // Ensure IDB is imported

export interface IPromotions {
    
  promotionsBySuperId(storeName: string): Promise<IDB['Promotion']>; // Use IDB type for promotions
}