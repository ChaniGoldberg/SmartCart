import { Item } from "@smartcart/shared/src/item";
import ItemService from "./itemService";
import PriceService from "./priceService";
import { Price } from "@smartcart/shared/src/price";
import { ISearchService } from "../interfaces/ISearchService";
import { SearchForProductByName } from "./tagServices/searchForProductByName";
import { ItemRepository } from "../db/Repositories/itemRepository";
import { PriceRepository } from "../db/Repositories/priceRepository";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL || "your-supabase-url";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "your-anon-key";
const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export class searchService implements ISearchService {
    private itemService: ItemService;
    private priceService: PriceService;
    constructor() {
        const itemRepository = new ItemRepository(supabaseClient);
        const priceRepository = new PriceRepository(supabaseClient);
        this.itemService = new ItemService();//itemRepository
        this.priceService = new PriceService(priceRepository);
    }
    async getItemsWithPrices(itemTxt: string): Promise<{ item: Item, price: Price | null }[]> {
        try {
            const items = await SearchForProductByName(itemTxt);
            const prices = await this.priceService.getAllPrices();
            return items.map(item => {
                const price = prices.find(price => price.itemCode === item.itemCode);
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