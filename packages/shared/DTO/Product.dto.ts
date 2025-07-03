export class ProductDTO {
    productId: string;
    ProductName: string;
    price: number;
    storeName: string;

    constructor(productId: string, ProductName: string, price: number, storeName: string) {
        this.productId = productId;
        this.ProductName = ProductName;
        this.price = price;
        this.storeName = storeName;
    }
}