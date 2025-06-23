import { Category } from "@smartcart/shared/src/categories"
import { Price } from "@smartcart/shared/src/prices";

export interface dataExtractions {

    getAllItem(): Promise<Price>
    getItemByItemCode(itemCode: number): Promise<Price | null>
    addItem(item: Price): Promise<void>
    updateItem(item: Price): Promise<void>
    addCategory(categoryName: string): Promise<Category> 

}