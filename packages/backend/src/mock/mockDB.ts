import itemsJson from "./mockData.json";
import categoriesJson from "./mockCategories.json";
import { IDB } from "../interfaces/IDB";
import { Category } from "@smartcart/shared/src/categories";
import { Item } from "@smartcart/shared";

export const mockDb: IDB = {
    User: [],
    Promotion: [],
    Store: [],
    Price: [],
    Item_Tag: [],
    Item: itemsJson as Item[],
    Tag: (categoriesJson as any).categories as Category[],
};