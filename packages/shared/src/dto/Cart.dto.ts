import { ProductDTO } from "./Product.dto";

export class CartDTO {
    storeName: string;
    address: string;
    products:ProductDTO[];

    constructor(storeName: string, address: string, products: ProductDTO[]) {
        this.storeName = storeName;
        this.address = address;
        this.products = products;
    }
}