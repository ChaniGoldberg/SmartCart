import { StoreRepository } from "../db/Repositories/storeRepository";
import { supabase } from "./supabase";
export class ProductService {
  private productRepository: StoreRepository;

  constructor() {
    this.productRepository = new StoreRepository(supabase);
  }

  async getProductsByCategoryAndStores(categoryName: string, storePKs: string[]) {
    return await this.productRepository.getProductsByCategoryAndStores(categoryName, storePKs);
  }
}
