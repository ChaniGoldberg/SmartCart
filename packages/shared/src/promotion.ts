import { Item } from "./item";
import { Price } from "./price";
export interface Promotion {
    // Core identification
    promotionId: number;//pk
    storeuid: string;   //fk   
    // promo core info
    promotionDescription: string;
    // time
    startDate: Date;
    endDate: Date;
    lastUpdated: Date;
    isActive: boolean;
    // Basic information
    originalPrice?: number; // Need to lookup from item data
    discountedPrice: number;
    discountAmount?: number; // Calculated: originalPrice - discountedPrice
    discountPercentage?: number; // Calculated percentage
  //  promotionItemsCode: number[];//fk
    // conditions of promotions
    minQuantity?: number;
    maxQuantity?: number;
    //clubs?: Club[];
    //aditional restrictions
    requiresCoupon: boolean;
    requiresClubMembership: boolean;
    clubId?: number;
    additionalGiftCount?: number;
    minPurchaseAmount?: number;
    minNumberOfItemOfered?: number;
    // additional info
    remarks?: string;
}
// interface Club {
//     clubId: number;
// }
