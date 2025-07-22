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
            // const items = await this.itemRepository.fuzzySearchItemsByText(itemTxt);
            // console.log("items", items);
           // בינתיים:
            const items: Item[] = [
                {
                    itemCode: "1",
                    itemId: 1,
                    itemType: 1,
                    itemName: "milk",
                    correctItemName: "milk",
                    manufacturerName: "aaa",
                    manufactureCountry: "aaa",
                    manufacturerItemDescription: "aaa",
                    itemStatus: true,
                    tagsId: [1, 2, 3]
                }]

            // const prices = await this.priceService.getAllPrices();
            // console.log("prices", prices);
            //בינתיים:
            //עד שיהיה נתונים בדטה
            const prices: Price[] = [{
                priceId: 2,        // מזהה ייחודי למחיר
                storePK: "01-201540-2021212",
                itemId: 1,
                itemCode: "1",
                price: 6.5,
                priceUpdateDate: new Date("01/01/2025"),
                unitQuantity: "1",               // כמות ביחידת מידה (למשל: 1, 500ml)
                quantity: 1,             // כמות המוצר (למשל: מספר יחידות במלאי)
                unitOfMeasure: "ml",       // יחידת מידה (למשל: ק"ג, ליטר, יחידה)
                isWeighted: false,          // האם המוצר נמכר לפי משקל (1=כן, 0=לא)
                quantityInPackage: 1,   // כמות ביחידה ארוזה (למשל: 6 בקבוקים במארז)            
                unitOfMeasurePrice: 1,    // מחיר ליחידת מידה
                allowDiscount: true
            }]
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