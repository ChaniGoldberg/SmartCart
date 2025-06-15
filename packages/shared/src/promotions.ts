interface Promotion {

    // Core identification
    chainId: string;
    subChainId: string;
    storeId: string;
    
    // promo core info
    promotionId: number;
    promotionDescription: string;
    promotionUpdateDate: Date;
    promotionStartDateTime: Date;
    promotionEndDateTime: Date;

    // Basic information
    discountRate: number;
    promotionItems?: Item[];

    // conditions of promotions
    conditionsOfPromo: ConditionsOfPromo;
}

interface Item {
    itemCode: string;
}
interface ConditionsOfPromo{
    // add conditions
}
