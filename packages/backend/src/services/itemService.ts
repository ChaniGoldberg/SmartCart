import { IItem } from "../interfaces/IItem";
import { Item } from "@smartcart/shared/src/item";
import { db } from "../db/dbProvider";

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
    }
}

export default ItemService;
