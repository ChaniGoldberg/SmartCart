// src/repositories/promotion.repository.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { IPromotionRepository } from "../IRepositories/IpromotionRepository";
import { Promotion } from "../../../../shared/src/promotion";


export class PromotionRepository implements IPromotionRepository {
  private readonly tableName = 'promotion';
  private readonly promotionItemsTableName = 'promotion_items'; // <--- שם טבלת הקישור

  constructor(private supabase: SupabaseClient) { }

  // פונקציה להמרה ל-snake_case עבור Promotion
  // שינוי: Omit כדי לא לכלול promotionItemsCode
  private toDbPromotion(promo: Omit<Promotion, 'promotionItemsCode'>) {
    return {
      promotion_id: promo.promotionId,
      store_pk: promo.storePK, // Assuming storePK is a unique identifier for the store
      // store_uid: promo.storeId, // חדש: storeId
      promotion_description: promo.promotionDescription,
      start_date: promo.startDate.toISOString(), // Required now
      end_date: promo.endDate.toISOString(),     // Required now
      last_updated: promo.lastUpdated.toISOString(), // Required now
      is_active: promo.isActive,
      original_price: promo.originalPrice || null, // Optional, can be null in DB
      discounted_price: promo.discountedPrice,
      discount_amount: promo.discountAmount || null, // Optional, can be null in DB
      discount_percentage: promo.discountPercentage || null, // Optional, can be null in DB
      min_quantity: promo.minQuantity || null,
      max_quantity: promo.maxQuantity || null,
      requires_coupon: promo.requiresCoupon, // Required now
      requires_club_membership: promo.requiresClubMembership, // Required now
      club_id: promo.clubId || null,
      additional_gift_count: promo.additionalGiftCount || null,
      min_purchase_amount: promo.minPurchaseAmount || null,
      min_number_of_items_offered: promo.minNumberOfItemOfered || null,
      remarks: promo.remarks || null,
    };
  }

  // --- פונקציות לניהול קישורי Promotion-Item (ללא שינוי מהותי) ---

  async linkItemToPromotion(promotionId: number, itemCode: number): Promise<void> {
    try {
      console.log(`Linking item ${itemCode} to promotion ${promotionId} in ${this.promotionItemsTableName}`);
      const { error } = await this.supabase
        .from(this.promotionItemsTableName)
        .insert({ promotion_id: promotionId, item_code: itemCode });

      if (error) {
        if (error.code === '23505') {
          console.warn(`Link already exists: item ${itemCode} for promotion ${promotionId}.`);
          return;
        }
        console.error(`Error linking item ${itemCode} to promotion ${promotionId}:`, error);
        throw new Error(`Failed to link item to promotion: ${error.message}`);
      }
      console.log(`Item ${itemCode} linked to promotion ${promotionId} successfully.`);
    } catch (error: any) {
      console.error(`Error in linkItemToPromotion: ${error.message}`);
      throw error;
    }
  }

  async unlinkItemFromPromotion(promotionId: number, itemCode: number): Promise<void> {
    try {
      console.log(`Unlinking item ${itemCode} from promotion ${promotionId} in ${this.promotionItemsTableName}`);
      const { error } = await this.supabase
        .from(this.promotionItemsTableName)
        .delete()
        .eq('promotion_id', promotionId)
        .eq('item_code', itemCode);

      if (error) {
        console.error(`Error unlinking item ${itemCode} from promotion ${promotionId}:`, error);
        throw new Error(`Failed to unlink item from promotion: ${error.message}`);
      }
      console.log(`Item ${itemCode} unlinked from promotion ${promotionId} successfully.`);
    } catch (error: any) {
      console.error(`Error in unlinkItemFromPromotion: ${error.message}`);
      throw error;
    }
  }

  async getItemsByPromotionId(promotionId: number): Promise<number[]> {
    try {
      console.log(`Fetching items for promotion ${promotionId} from ${this.promotionItemsTableName}`);
      const { data, error } = await this.supabase
        .from(this.promotionItemsTableName)
        .select('item_code')
        .eq('promotion_id', promotionId);

      if (error) {
        console.error(`Error fetching items for promotion ${promotionId}:`, error);
        throw new Error(`Failed to fetch items for promotion: ${error.message}`);
      }
      return data ? data.map(row => row.item_code) : [];
    } catch (error: any) {
      console.error(`Error in getItemsByPromotionId: ${error.message}`);
      throw error;
    }
  }

  async setItemsForPromotion(promotionId: number, itemCodes: number[]): Promise<void> {
    try {
      console.log(`Setting items for promotion ${promotionId}: ${itemCodes.join(', ')}`);
      const { error: deleteError } = await this.supabase
        .from(this.promotionItemsTableName)
        .delete()
        .eq('promotion_id', promotionId);

      if (deleteError) {
        console.error(`Error deleting existing items for promotion ${promotionId}:`, deleteError);
        throw new Error(`Failed to clear existing items for promotion: ${deleteError.message}`);
      }

      if (itemCodes.length > 0) {
        const newLinks = itemCodes.map(itemCode => ({ promotion_id: promotionId, item_code: itemCode }));
        const { error: insertError } = await this.supabase
          .from(this.promotionItemsTableName)
          .insert(newLinks);

        if (insertError) {
          console.error(`Error inserting new items for promotion ${promotionId}:`, insertError);
          throw new Error(`Failed to set new items for promotion: ${insertError.message}`);
        }
      }
      console.log(`Items for promotion ${promotionId} set successfully.`);
    } catch (error: any) {
      console.error(`Error in setItemsForPromotion: ${error.message}`);
      throw error;
    }
  }

  // --- עדכון פונקציות CRUD קיימות ---

  async addPromotion(promotion: Promotion): Promise<Promotion> {
    try {
      console.log(`Adding promotion: ${promotion.promotionDescription} to Supabase`);
      // הפרד את promotionItemsCode
      const { promotionItemsCode, ...promoToInsert } = promotion;

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([this.toDbPromotion(promoToInsert)])
        .select('*');

      if (error) {
        console.error('Error inserting promotion:', error);
        throw new Error(`Failed to add promotion: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after adding promotion.');
      }

      const addedPromotionDb = data[0];

      // אם יש קודי פריטים, הוסף אותם לטבלת הקישור
      if (promotionItemsCode && promotionItemsCode.length > 0) {
        await this.setItemsForPromotion(addedPromotionDb.promotion_id, promotionItemsCode);
      }

      console.log('Promotion added successfully:', addedPromotionDb);
      // החזר את אובייקט ה-Promotion המקורי עם ה-promotionItemsCode שלו
      return {
        ...addedPromotionDb,
        promotionItemsCode: promotionItemsCode || []
      } as Promotion;
    } catch (error: any) {
      console.error(`Error in addPromotion: ${error.message}`);
      throw error;
    }
  }

  async addManyPromotions(promotions: Promotion[]): Promise<Promotion[]> {
    if (promotions.length === 0) {
      console.log('No promotions to add.');
      return [];
    }

    try {
      console.log(`Adding ${promotions.length} promotions to Supabase via bulk insert`);
      const dbPromotionsToInsert = promotions.map(({ promotionItemsCode, ...rest }) => this.toDbPromotion(rest));
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(dbPromotionsToInsert)
        .select('*');

      if (error) {
        console.error('Error inserting multiple promotions:', error);
        throw new Error(`Failed to add multiple promotions: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned after adding multiple promotions.');
      }

      // טפל בקישורי הפריטים בנפרד עבור כל מבצע
      for (const promotion of promotions) {
        if (promotion.promotionItemsCode && promotion.promotionItemsCode.length > 0) {
          await this.setItemsForPromotion(promotion.promotionId, promotion.promotionItemsCode);
        }
      }

      console.log(`${data.length} promotions added successfully.`);
      return promotions;
    } catch (error: any) {
      console.error(`Error in addManyPromotions: ${error.message}`);
      throw error;
    }
  }

  async updatePromotion(promotion: Promotion): Promise<Promotion> {
    try {
      console.log(`Updating promotion: ${promotion.promotionDescription} (id: ${promotion.promotionId}) in Supabase`);
      // הפרד את promotionItemsCode
      const { promotionItemsCode, ...promoToUpdate } = promotion;

      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(this.toDbPromotion(promoToUpdate))
        .eq('promotion_id', promotion.promotionId)
        .select('*');

      if (error) {
        console.error('Error updating promotion:', error);
        throw new Error(`Failed to update promotion: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after updating promotion.');
      }

      const updatedDbPromotion = data[0];

      // עדכן את הקישורים בטבלת הקישור אם promotionItemsCode סופק
      if (promotionItemsCode !== undefined) {
        await this.setItemsForPromotion(promotion.promotionId, promotionItemsCode);
      }

      console.log('Promotion updated successfully:', updatedDbPromotion);
      return {
        ...updatedDbPromotion,
        promotionItemsCode: promotionItemsCode || []
      } as Promotion;
    } catch (error: any) {
      console.error(`Error in updatePromotion: ${error.message}`);
      throw error;
    }
  }

  async updateManyPromotions(promotions: Promotion[]): Promise<Promotion[]> {
    if (promotions.length === 0) {
      console.log('No promotions to update.');
      return [];
    }

    try {
      console.log(`Updating ${promotions.length} promotions in Supabase`);
      const updatedPromotions: Promotion[] = [];
      for (const promotion of promotions) {
        // הפרד promotionItemsCode
        const { promotionItemsCode, ...promoToUpdate } = promotion;

        const { data, error } = await this.supabase
          .from(this.tableName)
          .update(this.toDbPromotion(promoToUpdate))
          .eq('promotion_id', promotion.promotionId)
          .select('*');

        if (error) {
          console.error(`Error updating promotion with id ${promotion.promotionId}:`, error);
          throw new Error(`Failed to update promotion with id ${promotion.promotionId}: ${error.message}`);
        }

        if (!data || data.length === 0) {
          console.error(`No data returned after updating promotion with id ${promotion.promotionId}.`);
          continue;
        }

        // עדכן את הקישורים בטבלת הקישור
        if (promotionItemsCode !== undefined) {
          await this.setItemsForPromotion(promotion.promotionId, promotion.promotionItemsCode);
        }
        updatedPromotions.push(promotion);
      }
      console.log(`${updatedPromotions.length} promotions updated successfully.`);
      return updatedPromotions;
    } catch (error: any) {
      console.error(`Error in updateManyPromotions: ${error.message}`);
      throw error;
    }
  }

  async getAllPromotions(): Promise<Promotion[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*');

      if (error) {
        console.error('Error fetching all promotions:', error);
        throw new Error(`Failed to fetch promotions: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      // שלוף את כל הקישורים בין מבצעים לפריטים
      const { data: promotionItemsData, error: promotionItemsError } = await this.supabase
        .from(this.promotionItemsTableName)
        .select('promotion_id,item_code');

      if (promotionItemsError) {
        console.error('Error fetching promotion-items relationships:', promotionItemsError);
        throw new Error(`Failed to fetch promotion-items relationships: ${promotionItemsError.message}`);
      }

      const promotionItemsMap = new Map<number, number[]>();
      if (promotionItemsData) {
        promotionItemsData.forEach(row => {
          const promotionId = row.promotion_id;
          const itemCode = row.item_code;
          if (!promotionItemsMap.has(promotionId)) {
            promotionItemsMap.set(promotionId, []);
          }
          promotionItemsMap.get(promotionId)?.push(itemCode);
        });
      }

      // צרף את קודי הפריטים לכל מבצע
      const promotionsWithItems = data.map(dbPromo => ({
        ...dbPromo,
        startDate: new Date(dbPromo.start_date), // Convert to Date object
        endDate: new Date(dbPromo.end_date),     // Convert to Date object
        lastUpdated: new Date(dbPromo.last_updated), // Convert to Date object
        promotionItemsCode: promotionItemsMap.get(dbPromo.promotion_id) || []
      })) as Promotion[];

      return promotionsWithItems;
    } catch (error: any) {
      console.error(`Error in getAllPromotions: ${error.message}`);
      throw error;
    }
  }

  async getPromotionById(promotionId: number): Promise<Promotion | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('promotion_id', promotionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching promotion by id:', error);
        throw new Error(`Failed to fetch promotion: ${error.message}`);
      }

      if (data) {
        const itemCodes = await this.getItemsByPromotionId(promotionId); // קבל את קודי הפריטים
        return {
          ...data,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          lastUpdated: new Date(data.last_updated),
          promotionItemsCode: itemCodes
        } as Promotion;
      }
      return null;
    } catch (error: any) {
      console.error(`Error in getPromotionById: ${error.message}`);
      throw error;
    }
  }


  async SelectPromotionsByStorePK(storePK: string) : Promise<Promotion[]>  {
    if (!storePK || typeof storePK !== "string") {
      throw { status: 400, message: "Invalid or missing storePK" };
    }
    const today = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("promotion")
      .select("*")
      .eq("store_pk", storePK) // שימוש ישיר במחרוזת
      .lte("start_date", today)
      .gte("end_date", today);
    if (error) {
      console.error("Supabase error:", error.message);
      throw { status: 500, message: "Failed to fetch promotions" };
    }
    return (data as Promotion[]) || [];
  }

  async getPromotionsByStorePK(storePK: string): Promise<Promotion[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('store_pk', storePK);

      if (error) {
        console.error(`Error fetching promotions for store ${storePK}:`, error);
        throw new Error(`Failed to fetch promotions by store ID: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      // שלוף את כל הקישורים בין מבצעים לפריטים עבור המבצעים שנשלפו
      const promotionIds = data.map(p => p.promotion_id);
      const { data: promotionItemsData, error: promotionItemsError } = await this.supabase
        .from(this.promotionItemsTableName)
        .select('promotion_id,item_code')
        .in('promotion_id', promotionIds);

      if (promotionItemsError) {
        console.error('Error fetching promotion-items relationships:', promotionItemsError);
        throw new Error(`Failed to fetch promotion-items relationships: ${promotionItemsError.message}`);
      }

      const promotionItemsMap = new Map<number, number[]>();
      if (promotionItemsData) {
        promotionItemsData.forEach(row => {
          const promotionId = row.promotion_id;
          const itemCode = row.item_code;
          if (!promotionItemsMap.has(promotionId)) {
            promotionItemsMap.set(promotionId, []);
          }
          promotionItemsMap.get(promotionId)?.push(itemCode);
        });
      }

      // צרף את קודי הפריטים לכל מבצע
      const promotionsWithItems = data.map(dbPromo => ({
        ...dbPromo,
        startDate: new Date(dbPromo.start_date),
        endDate: new Date(dbPromo.end_date),
        lastUpdated: new Date(dbPromo.last_updated),
        promotionItemsCode: promotionItemsMap.get(dbPromo.promotion_id) || []
      })) as Promotion[];

      return promotionsWithItems;
    } catch (error: any) {
      console.error(`Error in getPromotionsByStorePK: ${error.message}`);
      throw error;
    }
  }

  async deletePromotionById(promotionId: number): Promise<void> {
    try {
      // לפני מחיקת המבצע, מחק את כל הקישורים שלו מטבלת promotion_items
      console.log(`Deleting all items linked to promotion ${promotionId} from ${this.promotionItemsTableName}`);
      const { error: deleteItemsError } = await this.supabase
        .from(this.promotionItemsTableName)
        .delete()
        .eq('promotion_id', promotionId);

      if (deleteItemsError) {
        console.error(`Error deleting linked items for promotion ${promotionId}:`, deleteItemsError);
        throw new Error(`Failed to delete linked items for promotion: ${deleteItemsError.message}`);
      }

      console.log(`Deleting promotion with id ${promotionId} from ${this.tableName}`);
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('promotion_id', promotionId);

      if (error) {
        console.error('Error deleting promotion:', error);
        throw new Error(`Failed to delete promotion: ${error.message}`);
      }
      console.log(`Promotion with id ${promotionId} and its linked items deleted successfully.`);
    } catch (error: any) {
      console.error(`Error in deletePromotionById: ${error.message}`);
      throw error;
    }
  }
}