export class ProductDTO {
    itemCode: number;
    priceId: number;
    ProductName: string;
    storePK: string;
    itemName: string;
    itemStatus: boolean;
    manufacturerItemDescription: string;
    manufacturerName: string;
    price: number;
    unitOfMeasurePrice: number;
    quantityInPackage: number;
    hasPromotion?: number;
    promotionText?: string;

 constructor(
        itemCode: number,
        priceId: number,
        ProductName: string,
        storePK: string,
        itemName: string,
        itemStatus: boolean,
        manufacturerItemDescription: string,
        manufacturerName: string,
        price: number,
        unitOfMeasurePrice: number,
        quantityInPackage: number,
        hasPromotion?: number,
        promotionText?: string
    ) {
        this.itemCode = itemCode;
        this.priceId = priceId;
        this.ProductName = ProductName;
        this.storePK = storePK;
        this.itemName = itemName;
        this.itemStatus = itemStatus;
        this.manufacturerItemDescription = manufacturerItemDescription;
        this.manufacturerName = manufacturerName;
        this.price = price;
        this.unitOfMeasurePrice = unitOfMeasurePrice;
        this.quantityInPackage = quantityInPackage;
        this.hasPromotion = hasPromotion;
        this.promotionText = promotionText;
    }
}


