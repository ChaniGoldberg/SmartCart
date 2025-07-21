import { ProductDTO } from './Product.dto';

export class ProductCartDTO {
  product: ProductDTO;
  quantity: number;

  constructor(product: ProductDTO, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }
}
