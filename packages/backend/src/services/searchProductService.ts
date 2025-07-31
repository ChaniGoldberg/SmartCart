import { Item, ProductDTO } from "@smartcart/shared";
import { ItemRepository } from "@smartcart/backend/src/db/Repositories/itemRepository";
import { PriceRepository } from "@smartcart/backend/src/db/Repositories/priceRepository";
import PriceService from "./priceService";
import { Price } from "@smartcart/shared";
import { IsearchProductService } from "../interfaces/IsearchProductService";
import { supabase } from "./supabase";
export class searchProductService implements IsearchProductService {
    private priceService: PriceService;
    private itemRepository: ItemRepository;
    private priceRepository: PriceRepository;
    constructor() {
        this.itemRepository = new ItemRepository(supabase);
        this.priceRepository = new PriceRepository(supabase);
        this.priceService = new PriceService(this.priceRepository);
    }

    async SearchItemsJoinPriceForStores(itemTxt:string,storepks:string[]): Promise<ProductDTO[]> {
        try {
            const items = await this.itemRepository.fuzzySearchItemsJoinPriceForStores(itemTxt, storepks);
            if (!items) {
                return [];
            }
            return items;
        } catch (error) {
            console.error("Error retrieving items with prices:", error);
            throw new Error("Could not retrieve items with prices");
        }
    }
}

export default searchProductService;