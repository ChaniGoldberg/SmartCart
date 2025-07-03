import { Item } from "@smartcart/shared/src/Item"

export interface IItem {

    getAllItem(): Promise<Item[]>
    getItemById(itemCode: number): Promise<Item | null>
    addItem(item: Item): Promise<void>
    updateItem(item: Item): Promise<void>
    
}