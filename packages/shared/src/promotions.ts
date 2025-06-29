import { Price } from "./prices";
export interface Promotion {
    // Core identification
    promotionId: number;//pk
    storeId: number;//fk
    priceId: number;//fk
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
    promotionPricesOfItems?: Price[];//fk
    // conditions of promotions
    minQuantity?: number;
    maxQuantity?: number;
    //clubs?: Club[];
    //aditional restrictions
    requiresCoupon: boolean;
    requiresClubMembership: boolean;
    clubId?: string;
    additionalGiftCount?: number;
    minPurchaseAmount?: number;
    minNumberOfItemOfered?: number;
    // additional info
    remarks?: string;
}
interface Club {
    clubId: number;
}
