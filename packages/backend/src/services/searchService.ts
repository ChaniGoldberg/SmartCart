import { Item } from "@smartcart/shared/src/item";
import { ItemRepository } from "@smartcart/backend/src/db/Repositories/itemRepository";
import { PriceRepository } from "@smartcart/backend/src/db/Repositories/priceRepository";
import PriceService from "./priceService";
import { Price } from "@smartcart/shared/src/price";
import { ISearchService } from "../interfaces/ISearchService";
import { supabase } from "./supabase";
export class searchService implements ISearchService {
    private priceService: PriceService;
    private itemRepository: ItemRepository;
    private priceRepository: PriceRepository;
    constructor() {
        this.itemRepository = new ItemRepository(supabase);
        this.priceRepository = new PriceRepository(supabase);
        this.priceService = new PriceService(this.priceRepository);
    }
    async getItemsWithPrices(itemTxt: string): Promise<{ item: Item, price: Price | null }[]> {
        try {
            const items = await this.itemRepository.fuzzySearchItemsByText(itemTxt);
            console.log("items", items);
         
            const prices = await this.priceService.getAllPrices();
            console.log("prices", prices);
            return items.map(item => {
                const price = prices.find(price => price.itemCode === item.itemCode && item.itemStatus === true);
                return {
                    item,
                    price: price || null,
                };
            }).filter(({ price }) => price !== null);
        } catch (error) {
            console.error("Error retrieving items with prices:", error);
            throw new Error("Could not retrieve items with prices");
        }
    }
}
export default searchService;