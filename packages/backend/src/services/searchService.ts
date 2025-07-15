import { Item } from "@smartcart/shared/src/item";

import ItemService from "./itemService";
import PriceService from "./priceService";
import { Price } from "@smartcart/shared/src/price";
import { ISearchService } from "../interfaces/ISearchService";
import { SearchForProductByName } from "./tagServices/searchForProductByName";

export class  searchService implements ISearchService {
    private itemService: ItemService;
    private priceService: PriceService;

    constructor() {
        this.itemService = new ItemService();
        this.priceService = new PriceService();
    }

   async getItemsWithPrices(itemTxt:string): Promise<{ item: Item, price: Price | null}[]> {
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