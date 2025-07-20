import { IItem } from "../interfaces/IItem";
import { Item } from "@smartcart/shared/src/item";
import { db } from "../db/dbProvider";
import { ItemRepository } from "../db/Repositories/itemRepository";
import { supabase } from "./supabase";
const itemRepository=new ItemRepository(supabase);
export class ItemService implements IItem {
    private db: typeof db;

    constructor() {
        this.db = db;
    }

    async getAllItem(): Promise<Item[]> {
        return this.db.Item;;
    }

async getItemById(itemCode: number): Promise<Item | null> {
    const foundItem = this.db.Item.find((item: Item) => item.itemCode === itemCode);
    return foundItem ? foundItem : null;
}

    async addItem(item: Item): Promise<void> {
    }

    async updateItem(item: Item): Promise<void> {
       await itemRepository.updateItem(item)
    }

    async deleteTagIdFromItemAndUpdate(item: Item, tagIdToDelete: number): Promise<void> {
    // מחיקת התג מהמערך
    const updatedItem: Item = {
        ...item,
        tagsId: Array.isArray(item.tagsId)
            ? item.tagsId.filter(id => id !== tagIdToDelete)
            : item.tagsId
    };
    // קריאה לפונקציית עדכון שנמצאת באותו class
    await this.updateItem(updatedItem);
}
}

 

export default ItemService;
