import { Item } from "@smartcart/shared";
import { ItemRepository } from "../db/Repositories/itemRepository";
import { supabase } from "./supabase";
export class ItemService {
    private itemRepository: ItemRepository;
    constructor() {     
        this.itemRepository = new ItemRepository(supabase);
    }
    async getAllItem(): Promise<Item[]> {
        return await this.itemRepository.getAllItems();
    }
    async getItemById(itemCode: string): Promise<Item | null> {
        return await this.itemRepository.getItemByItemCode(itemCode);
    }
    async addItem(item: Item): Promise<void> {
        await this.itemRepository.addItem(item);
    }
    async updateItem(item: Item): Promise<void> {
        await this.itemRepository.updateItem(item);
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