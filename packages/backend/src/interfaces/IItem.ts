import { Price } from "@smartcart/shared/src/prices"

export interface IItem {

    getAllItem(): Promise<Price[]>
    getItemById(itemCode: string): Promise<Price[] | null>
    addItem(item: Price): Promise<void>
    updateItem(item: Price): Promise<void>
    
}