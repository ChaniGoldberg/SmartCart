import { Item } from "@smartcart/shared/src/Item"
import { Price } from "@smartcart/shared/src/price"

export interface ISearchService {

    getItemsWithPrices(itemTxt:string): Promise<{ item: Item, price: Price |null}[]>

    
}