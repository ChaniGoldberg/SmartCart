import { Item } from "../../../../shared/src/item";

export interface IItemRepository {
  addItem(item: Item): Promise<Item>;
  addManyItems(items: Item[]): Promise<Item[]>;
  updateItem(item: Item): Promise<Item>;
  updateManyItems(items: Item[]): Promise<Item[]>;
  getAllItems(): Promise<Item[]>;
  getItemByItemCode(itemCode: number): Promise<Item | null>;
  deleteItemByItemCode(itemCode: number): Promise<void>;
  fuzzySearchItemsByText(itemText: string): Promise<Item[]>; // Change to return a Promise
  
// --- קשרי תגיות (ללא שינוי בפונקציות הקישור עצמן) ---
linkTagToItem(itemCode: number, tagId: number): Promise<void>;
unlinkTagFromItem(itemCode: number, tagId: number): Promise<void>;
getTagsByItemCode(itemCode: number): Promise<number[]>;
setTagsForItem(itemCode: number, tagIds: number[]): Promise<void>;

// --- חדש: פונקציות לשליפת מבצעים המשויכים לפריט (אין יותר set/link/unlink ישירות דרך item repo) ---
// הפריט לא מנהל את המבצעים שהוא חלק מהם, המבצעים מנהלים את הפריטים שהם מכילים.
// לכן, נשאיר רק פונקציית שליפה, שתשמש לקבלת הנתונים המלאים של פריט.
getPromotionsByItemCode(itemCode: number): Promise<number[]>;
}