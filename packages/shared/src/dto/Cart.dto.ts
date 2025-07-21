import { ProductCartDTO } from "./ProductCart.dto";
export class CartDTO {
    storeName: string;
    address: string;
    products:ProductCartDTO[];
    totalPrice: number;
    constructor(storeName: string, address: string, products: ProductCartDTO[],totalPrice: number) {
        this.totalPrice = totalPrice;
        this.storeName = storeName;
        this.address = address;
        this.products = products;
    }
}
