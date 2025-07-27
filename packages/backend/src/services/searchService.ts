import { Item } from "@smartcart/shared";
import { ItemRepository } from "@smartcart/backend/src/db/Repositories/itemRepository";
import { PriceRepository } from "@smartcart/backend/src/db/Repositories/priceRepository";
import PriceService from "./priceService";
import { Price } from "@smartcart/shared";
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

    async getItemsWithPrices(itemTxt: string): Promise<{ item: Item, price: any | null }[]> {
        try {
            const items = await this.itemRepository.fuzzySearchItemsByText(itemTxt);
            const prices = await this.priceService.getAllPrices();

            return items.map(item => {
                const price = prices.find(price => price.item_code === item.itemCode )//&& item.itemStatus === true);את זה צריך להוריד מירוק אחרי שיכניסו לדטה בייס מוצרים פעילים
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