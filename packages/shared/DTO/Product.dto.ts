export class ProductDTO {
    productId: string;
    ProductName: string;
    storeName: string;
    itemName: string;
    itemStatus: boolean;
    manufacturerItemDescription: string;
    manufacturerName: string;
    price: number;
    unitOfMeasurePrice: number;
    quantityInPackage: string;
    tagId: number;
    tagName: string;

    constructor(
        productId: string,
        ProductName: string,
        storeName: string,
        itemName: string,
        itemStatus: boolean,
        manufacturerItemDescription: string,
        manufacturerName: string,
        price: number,
        unitOfMeasurePrice: number,
        quantityInPackage: string,
        tagId: number,
        tagName: string
    ) {
        this.productId = productId;
        this.ProductName = ProductName;
        this.storeName = storeName;
        this.itemName = itemName;
        this.itemStatus = itemStatus;
        this.manufacturerItemDescription = manufacturerItemDescription;
        this.manufacturerName = manufacturerName;
        this.price = price;
        this.unitOfMeasurePrice = unitOfMeasurePrice;
        this.quantityInPackage = quantityInPackage;
        this.tagId = tagId;
        this.tagName = tagName;
    }
}