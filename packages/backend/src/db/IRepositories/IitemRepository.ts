import { Item } from "../../../../shared/src/item";

export interface IItemRepository {
  addItem(item: Item): Promise<Item>;
  addManyItems(items: Item[]): Promise<Item[]>;
  updateItem(item: Item): Promise<Item>;
  updateManyItems(items: Item[]): Promise<Item[]>;
  getAllItems(): Promise<Item[]>;
  getItemByItemCode(itemCode: string): Promise<Item | null>;
  deleteItemByItemCode(itemCode: string): Promise<void>;
  getItemsWithoutTags():Promise<Item[]>;
  fuzzySearchItemsByText(itemText: string): Promise<Item[]>; // Change to return a Promise
  
// --- קשרי תגיות (ללא שינוי בפונקציות הקישור עצמן) ---
linkTagToItem(itemCode: string, tagId: number): Promise<void>;
unlinkTagFromItem(itemCode: string, tagId: number): Promise<void>;
getTagsByItemCode(itemCode: string): Promise<number[]>;
setTagsForItem(itemCode: string, tagIds: number[]): Promise<void>;

// --- חדש: פונקציות לשליפת מבצעים המשויכים לפריט (אין יותר set/link/unlink ישירות דרך item repo) ---
// הפריט לא מנהל את המבצעים שהוא חלק מהם, המבצעים מנהלים את הפריטים שהם מכילים.
// לכן, נשאיר רק פונקציית שליפה, שתשמש לקבלת הנתונים המלאים של פריט.
getPromotionsByItemCode(itemCode: string): Promise<number[]>;
}