export class ProductDTO {
    itemCode: number;
    productId: string;
    ProductName: string;
    storePK: string;
    itemName: string;
    itemStatus: boolean;
    manufacturerItemDescription: string;
    manufacturerName: string;
    price: number;
    unitOfMeasurePrice: number;
    quantityInPackage: string;

    constructor(
        itemCode: number,
        productId: string,
        ProductName: string,
        storePK: string,
        itemName: string,
        itemStatus: boolean,
        manufacturerItemDescription: string,
        manufacturerName: string,
        price: number,
        unitOfMeasurePrice: number,
        quantityInPackage: string,
      
    ) {
        this.itemCode = itemCode
        this.productId = productId;
        this.ProductName = ProductName;
        this.storePK = storePK;
        this.itemName = itemName;
        this.itemStatus = itemStatus;
        this.manufacturerItemDescription = manufacturerItemDescription;
        this.manufacturerName = manufacturerName;
        this.price = price;
        this.unitOfMeasurePrice = unitOfMeasurePrice;
        this.quantityInPackage = quantityInPackage;
    }
 }