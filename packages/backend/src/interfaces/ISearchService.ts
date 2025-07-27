import { Item } from "@smartcart/shared"
import { Price } from "@smartcart/shared"

export interface ISearchService {

    getItemsWithPrices(itemTxt:string): Promise<{ item: Item, price: Price |null}[]>

    
}