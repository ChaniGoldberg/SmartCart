// src/repositories/item.repository.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { Item } from "../../../../shared/src/item"; // ודא שהנתיב ל-Item נכון
import { IItemRepository } from "../IRepositories/IitemRepository"; // ודא שהנתיב ל-IItemRepository נכון


export class ItemRepository implements IItemRepository {
  private readonly tableName = 'item';
  private readonly itemTagsTableName = 'item_tags';
  private readonly promotionItemsTableName = 'promotion_items';

  constructor(private supabase: SupabaseClient) { }

  /**
   * ממיר אובייקט Item (camelCase) לפורמט הנדרש עבור ה-DB (snake_case).
   * @param item אובייקט Item
   * @returns אובייקט בפורמט snake_case המתאים להכנסה ל-DB.
   */
  private toDbItem(item: Omit<Item, 'tagsId'>) {
    return {
      item_code: item.itemCode,
      item_id: item.itemId,
      item_type: item.itemType,
      item_name: item.itemName,
      correct_item_name: item.correctItemName,
      manufacturer_name: item.manufacturerName,
      manufacture_country: item.manufactureCountry,
      manufacturer_item_description: item.manufacturerItemDescription,
      item_status: item.itemStatus,
    };
  }

  /**
   * ממיר אובייקט מפורמט ה-DB (snake_case) לאובייקט Item (camelCase).
   * משמש בעת שליפת נתונים מה-DB.
   * @param dbItem האובייקט שחזר מה-Supabase (בפורמט snake_case).
   * @returns אובייקט Item בפורמט camelCase.
   */
  private fromDbItem(dbItem: any): Omit<Item, 'tagsId'> {
    return {
      itemCode: dbItem.item_code,
      itemId: dbItem.item_id,
      itemType: dbItem.item_type,
      itemName: dbItem.item_name,
      correctItemName: dbItem.correct_item_name,
      manufacturerName: dbItem.manufacturer_name,
      manufactureCountry: dbItem.manufacture_country,
      manufacturerItemDescription: dbItem.manufacturer_item_description,
      itemStatus: dbItem.item_status,
      // tagsId יתווסף בנפרד במתודות השליפה,promotionIds אינו חלק מ-Item ישירות.
    };
  }

async fuzzySearchItemsByText(itemText: string): Promise<Item[]> {
    // supabase = getClient();
    if (this.supabase != null) {
      const { data, error } = await this.supabase.rpc('fuzzy_search_items', { search_query: itemText });
      if (error) throw error;
      return data;
    }
    return []; // Return an empty array if supabase is null
  }

  async linkTagToItem(itemCode: number, tagId: number): Promise<void> {
    try {
      console.log(`Linking tag ${tagId} to item ${itemCode} in ${this.itemTagsTableName}`);
      const { error } = await this.supabase
        .from(this.itemTagsTableName)
        .insert({ item_code: itemCode, tag_id: tagId });

      if (error) {
        if (error.code === '23505') {
          console.warn(`Link already exists: tag ${tagId} for item ${itemCode}.`);
          return;
        }
        console.error(`Error linking tag ${tagId} to item ${itemCode}:`, error);
        throw new Error(`Failed to link tag: ${error.message}`);
      }
      console.log(`Tag ${tagId} linked to item ${itemCode} successfully.`);
    } catch (error: any) {
      console.error(`Error in linkTagToItem: ${error.message}`);
      throw error;
    }
  }

  async unlinkTagFromItem(itemCode: number, tagId: number): Promise<void> {
    try {
      console.log(`Unlinking tag ${tagId} from item ${itemCode} in ${this.itemTagsTableName}`);
      const { error } = await this.supabase
        .from(this.itemTagsTableName)
        .delete()
        .eq('item_code', itemCode)
        .eq('tag_id', tagId);

      if (error) {
        console.error(`Error unlinking tag ${tagId} from item ${itemCode}:`, error);
        throw new Error(`Failed to unlink tag: ${error.message}`);
      }
      console.log(`Tag ${tagId} unlinked from item ${itemCode} successfully.`);
    } catch (error: any) {
      console.error(`Error in unlinkTagFromItem: ${error.message}`);
      throw error;
    }
  }

  async getTagsByItemCode(itemCode: number): Promise<number[]> {
    try {
      console.log(`Fetching tags for item ${itemCode} from ${this.itemTagsTableName}`);
      const { data, error } = await this.supabase
        .from(this.itemTagsTableName)
        .select('tag_id')
        .eq('item_code', itemCode);

      if (error) {
        console.error(`Error fetching tags for item ${itemCode}:`, error);
        throw new Error(`Failed to fetch tags for item: ${error.message}`);
      }
      return data ? data.map(row => row.tag_id) : [];
    } catch (error: any) {
      console.error(`Error in getTagsByItemCode: ${error.message}`);
      throw error;
    }
  }

  async setTagsForItem(itemCode: number, tagIds: number[]): Promise<void> {
    try {
      console.log(`Setting tags for item ${itemCode}: ${tagIds.join(', ')}`);
      // מוחק קישורים קיימים עבור הפריט
      const { error: deleteError } = await this.supabase
        .from(this.itemTagsTableName)
        .delete()
        .eq('item_code', itemCode);

      if (deleteError) {
        console.error(`Error deleting existing tags for item ${itemCode}:`, deleteError);
        throw new Error(`Failed to clear existing tags for item: ${deleteError.message}`);
      }

      // מוסיף את הקישורים החדשים אם קיימים תגיות
      if (tagIds.length > 0) {
        const newLinks = tagIds.map(tagId => ({ item_code: itemCode, tag_id: tagId }));
        const { error: insertError } = await this.supabase
          .from(this.itemTagsTableName)
          .insert(newLinks);

        if (insertError) {
          console.error(`Error inserting new tags for item ${itemCode}:`, insertError);
          throw new Error(`Failed to set new tags for item: ${insertError.message}`);
        }
      }
      console.log(`Tags for item ${itemCode} set successfully.`);
    } catch (error: any) {
      console.error(`Error in setTagsForItem: ${error.message}`);
      throw error;
    }
  }

  async getPromotionsByItemCode(itemCode: number): Promise<number[]> {
    try {
      console.log(`Fetching promotions for item ${itemCode} from ${this.promotionItemsTableName}`);
      const { data, error } = await this.supabase
        .from(this.promotionItemsTableName)
        .select('promotion_id')
        .eq('item_code', itemCode);

      if (error) {
        console.error(`Error fetching promotions for item ${itemCode}:`, error);
        throw new Error(`Failed to fetch promotions for item: ${error.message}`);
      }
      return data ? data.map(row => row.promotion_id) : [];
    } catch (error: any) {
      console.error(`Error in getPromotionsByItemCode: ${error.message}`);
      throw error;
    }
  }

  async addItem(item: Item): Promise<Item> {
    try {
      console.log(`Adding item: ${item.itemName} (Code: ${item.itemCode}) to Supabase`);
      // הפרד את tagsId מהאובייקט לפני הכנסה לטבלת items
      const { tagsId, ...itemToInsert } = item;

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([this.toDbItem(itemToInsert)]) // הכנס נתונים בפורמט snake_case
        .select('*'); // שלוף את הפריט המלא שנוצר

      if (error) {
        console.error('Error inserting item:', error);
        throw new Error(`Failed to add item: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after adding item.');
      }

      const addedItemDb = data[0];
      // המר את האובייקט שחזר מה-DB לפורמט camelCase
      const addedItemCamelCase = this.fromDbItem(addedItemDb);

      // אם יש תגיות, הוסף אותן לטבלת הקישור
      if (tagsId && tagsId.length > 0) {
        // השתמש ב-itemCode שקיבלת מהאובייקט שהומר ל-camelCase
        await this.setTagsForItem(addedItemCamelCase.itemCode, tagsId);
      }

      console.log('Item added successfully:', addedItemDb);
      // החזר את האובייקט שהומר, וצרף בחזרה את tagsId
      return { ...addedItemCamelCase, tagsId: tagsId || [] } as Item;
    } catch (error: any) {
      console.error(`Error in addItem: ${error.message}`);
      throw error;
    }
  }

  async addManyItems(items: Item[]): Promise<Item[]> {
    if (items.length === 0) {
      console.log('No items to add.');
      return [];
    }

    try {
      console.log(`Adding ${items.length} items to Supabase via bulk insert`);
      const dbItemsToInsert = items.map(({ tagsId, ...rest }) => this.toDbItem(rest));

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(dbItemsToInsert)
        .select('*');

      if (error) {
        console.error('Error inserting multiple items:', error);
        throw new Error(`Failed to add multiple items: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned after adding multiple items.');
      }

      const addedItemsCamelCase: Item[] = [];
      for (const addedDbItem of data) {
        const camelCaseItem = this.fromDbItem(addedDbItem) as Item; // המר כל פריט
        const originalItem = items.find(item => item.itemCode === camelCaseItem.itemCode); // מצא את הפריט המקורי כדי לקבל את tagsId

        if (originalItem && originalItem.tagsId && originalItem.tagsId.length > 0) {
          await this.setTagsForItem(camelCaseItem.itemCode, originalItem.tagsId);
          camelCaseItem.tagsId = originalItem.tagsId; // ודא ש-tagsId מעודכן באובייקט המוחזר
        } else {
          camelCaseItem.tagsId = [];
        }
        addedItemsCamelCase.push(camelCaseItem);
      }

      console.log(`${data.length} items added successfully.`);
      return addedItemsCamelCase;
    } catch (error: any) {
      console.error(`Error in addManyItems: ${error.message}`);
      throw error;
    }
  }

  async updateItem(item: Item): Promise<Item> {
    try {
      console.log(`Updating item: ${item.itemName} (code: ${item.itemCode}) in Supabase`);
      const { tagsId, ...itemToUpdate } = item;

      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(this.toDbItem(itemToUpdate))
        .eq('item_code', item.itemCode)
        .select('*');

      if (error) {
        console.error('Error updating item:', error);
        throw new Error(`Failed to update item: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after updating item.');
      }

      const updatedDbItem = data[0];
      const updatedCamelCaseItem = this.fromDbItem(updatedDbItem);

      if (tagsId !== undefined) {
        await this.setTagsForItem(updatedCamelCaseItem.itemCode, tagsId);
      }

      console.log('Item updated successfully:', updatedDbItem);
      return { ...updatedCamelCaseItem, tagsId: tagsId || [] } as Item;
    } catch (error: any) {
      console.error(`Error in updateItem: ${error.message}`);
      throw error;
    }
  }

  async updateManyItems(items: Item[]): Promise<Item[]> {
    if (items.length === 0) {
      console.log('No items to update.');
      return [];
    }

    try {
      console.log(`Updating ${items.length} items in Supabase`);
      const updatedItems: Item[] = [];
      for (const item of items) {
        const { tagsId, ...itemToUpdate } = item;

        const { data, error } = await this.supabase
          .from(this.tableName)
          .update(this.toDbItem(itemToUpdate))
          .eq('item_code', item.itemCode)
          .select('*');

        if (error) {
          console.error(`Error updating item with code ${item.itemCode}:`, error);
          throw new Error(`Failed to update item with code ${item.itemCode}: ${error.message}`);
        }

        if (!data || data.length === 0) {
          console.error(`No data returned after updating item with code ${item.itemCode}.`);
          continue;
        }

        const updatedDbItem = data[0];
        const updatedCamelCaseItem = this.fromDbItem(updatedDbItem);

        if (tagsId !== undefined) {
          await this.setTagsForItem(updatedCamelCaseItem.itemCode, tagsId);
        }
        updatedItems.push({ ...updatedCamelCaseItem, tagsId: tagsId || [] } as Item);
      }
      console.log(`${updatedItems.length} items updated successfully.`);
      return updatedItems;
    } catch (error: any) {
      console.error(`Error in updateManyItems: ${error.message}`);
      throw error;
    }
  }

  async getAllItems(): Promise<Item[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*');

      if (error) {
        console.error('Error fetching all items:', error);
        throw new Error(`Failed to fetch items: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      // שלוף את כל הקישורים בין פריטים לתגיות בפעולה אחת (יעיל יותר מלולאה)
      const { data: itemTagsData, error: itemTagsError } = await this.supabase
        .from(this.itemTagsTableName)
        .select('item_code,tag_id');

      if (itemTagsError) {
        console.error('Error fetching item-tags relationships:', itemTagsError);
        throw new Error(`Failed to fetch item-tags relationships: ${itemTagsError.message}`);
      }

      const itemTagsMap = new Map<number, number[]>();
      if (itemTagsData) {
        itemTagsData.forEach(row => {
          const itemCode = row.item_code;
          const tagId = row.tag_id;
          if (!itemTagsMap.has(itemCode)) {
            itemTagsMap.set(itemCode, []);
          }
          itemTagsMap.get(itemCode)?.push(tagId);
        });
      }

      // המר את כל הפריטים מ-snake_case ל-camelCase וצרף את התגיות
      const itemsWithTags = data.map(dbItem => {
        const camelCaseItem = this.fromDbItem(dbItem) as Item;
        camelCaseItem.tagsId = itemTagsMap.get(camelCaseItem.itemCode) || [];
        return camelCaseItem;
      });

      return itemsWithTags;
    } catch (error: any) {
      console.error(`Error in getAllItems: ${error.message}`);
      throw error;
    }
  }

  async getItemByItemCode(itemCode: number): Promise<Item | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('item_code', itemCode)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // PGRST116 מציין "לא נמצאה שורה" (No rows found)
          return null;
        }
        console.error('Error fetching item by code:', error);
        throw new Error(`Failed to fetch item: ${error.message}`);
      }

      if (data) {
        // המר את הפריט מ-snake_case ל-camelCase
        const camelCaseItem = this.fromDbItem(data) as Item;
        const tagsId = await this.getTagsByItemCode(itemCode); // קבל את התגיות מטבלת הקישור
        camelCaseItem.tagsId = tagsId; // שלב את התגיות חזרה לאובייקט Item
        return camelCaseItem;
      }
      return null;
    } catch (error: any) {
      console.error(`Error in getItemByItemCode: ${error.message}`);
      throw error;
    }
  }

  async deleteItemByItemCode(itemCode: number): Promise<void> {
    try {
      // לפני מחיקת הפריט, מחק את כל הקישורים שלו מטבלת הקישור של תגיות
      console.log(`Deleting all tags linked to item ${itemCode} from ${this.itemTagsTableName}`);
      const { error: deleteTagsError } = await this.supabase
        .from(this.itemTagsTableName)
        .delete()
        .eq('item_code', itemCode);

      if (deleteTagsError) {
        console.error(`Error deleting linked tags for item ${itemCode}:`, deleteTagsError);
        throw new Error(`Failed to delete linked tags for item: ${deleteTagsError.message}`);
      }

      // מחק קישורי מבצעים גם מטבלת promotion_items
      console.log(`Deleting all promotions linked to item ${itemCode} from ${this.promotionItemsTableName}`);
      const { error: deletePromotionsError } = await this.supabase
        .from(this.promotionItemsTableName)
        .delete()
        .eq('item_code', itemCode);

      if (deletePromotionsError) {
        console.error(`Error deleting linked promotions for item ${itemCode}:`, deletePromotionsError);
        throw new Error(`Failed to delete linked promotions for item: ${deletePromotionsError.message}`);
      }

      // עכשיו מחק את הפריט עצמו
      console.log(`Deleting item with code ${itemCode} from ${this.tableName}`);
      const { error: deleteItemError } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('item_code', itemCode);

      if (deleteItemError) {
        console.error('Error deleting item:', deleteItemError);
        throw new Error(`Failed to delete item: ${deleteItemError.message}`);
      }
      console.log(`Item with code ${itemCode}, its linked tags and promotions deleted successfully.`);
    } catch (error: any) {
      console.error(`Error in deleteItemByItemCode: ${error.message}`);
      throw error;
    }
  }
}