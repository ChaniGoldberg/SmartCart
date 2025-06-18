import { Item } from "./types";

export interface Promotion {

    // Core identification
    chainId: string;
    subChainId: string;
    storeId: string;

    // promo core info
    promotionId: number;
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

    promotionItems?: Item[];

    // conditions of promotions
    promotionsTerms: PromotionsTerms;
}


interface PromotionsTerms {
    minQty?: number;
    maxQty?: number;
    clubs?: Club[];
    additionalRestrictions?: AdditionalRestrictions;
    minPurchaseAmnt?: number;
    minNoOfItemOfered?: number;
    // additional info
    remarks?: string;
}

interface Club {
    clubId: number;
}

interface AdditionalRestrictions {
    requiresCoupon: boolean;
    requiresClubMembership: boolean;
    clubId?: string;
    additionalGiftCount?: number;
}



