import { Item, ProductDTO } from "@smartcart/shared"
import { Price } from "@smartcart/shared"

export interface IsearchProductService {

    SearchItemsJoinPriceForStores(itemTxt:string,storepks:string[]): Promise<ProductDTO[]>

}