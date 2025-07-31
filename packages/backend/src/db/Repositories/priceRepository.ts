import { SupabaseClient } from "@supabase/supabase-js";
import { Price } from "@smartcart/shared";
import { IPriceRepository } from "../IRepositories/IPriceRepository";

export class PriceRepository implements IPriceRepository {
    private readonly tableName = 'price';

    constructor(private supabase: SupabaseClient) { }

    // פונקציה להמרה ל-snake_case
    public toDbPrice(price: Price):any {
        return {
            store_pk: price.storePK,
            item_id: price.itemId, // אם יש לך itemId במקום itemCode
            item_code: price.itemCode,
            price: price.price,
            price_update_date: price.priceUpdateDate,
            unit_quantity: price.unitQuantity,
            quantity: price.quantity,
            unit_of_measure: price.unitOfMeasure,
            is_weighted: price.isWeighted,
            quantity_in_package: price.quantityInPackage,
            unit_of_measure_price: price.unitOfMeasurePrice,
            allow_discount: price.allowDiscount,
        };
    }
    private fromDbToPrice(price:any ): Price {
        return {
          storePK: price.store_pk,
            itemId: price.item_id, // אם יש לך itemId במקום itemCode
          itemCode: price.item_code,
          price: price.price,
          priceUpdateDate: price.price_update_date,
          unitQuantity: price.unit_quantity,
          quantity: price.quantity,
          unitOfMeasure: price.unit_of_measure,
          isWeighted: price.is_weighted,
          quantityInPackage: price.quantity_in_package,
          unitOfMeasurePrice: price.unit_of_measure_price,
          allowDiscount: price.allow_discount,
        };
      }
      

    async addPrice(price: Price): Promise<Price> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert([this.toDbPrice(price)])
                .select('*');

            if (error) {
                console.error('Error inserting price:', error);
                throw new Error(`Failed to add price: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned after adding price.');
            }

            console.log('price added successfully:', data[0]);
            return price;
        } catch (error: any) {
            console.error(`Error in addPrice: ${error.message}`);
            throw error;
        }
    }

    async addManyPrices(prices: Price[]): Promise<Price[]> {
        if (prices.length === 0) {
            console.log('No prices to add.');
            return [];
        }

        try {
            console.log(`Adding ${prices.length} prices to Supabase via bulk insert`);
            const dbPrices = prices.map(price => this.toDbPrice(price));
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert(dbPrices)
                .select('*');

            if (error) {
                console.error('Error inserting multiple prices:', error);
                throw new Error(`Failed to add multiple prices: ${error.message}`);
            }

            if (!data) {
                throw new Error('No data returned after adding multiple prices.');
            }

            console.log(`${data.length} prices added successfully.`);
            return prices;
        } catch (error: any) {
            console.error(`Error in addManyPrices: ${error.message}`);
            throw error;
        }
    }

    async updatePrice(price: Price): Promise<Price> {
        try {
            console.log(`Updating price (id: ${price.priceId}) in Supabase`);
            const { data, error } = await this.supabase
                .from(this.tableName)
                .update(this.toDbPrice(price))
                .eq('price_id', price.priceId)
                .select('*');

            if (error) {
                console.error('Error updating price:', error);
                throw new Error(`Failed to update price: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned after updating price.');
            }

            console.log('Price updated successfully:', data[0]);
            return price;
        } catch (error: any) {
            console.error(`Error in updatePrice: ${error.message}`);
            throw error;
        }
    }

    async upsertManyPrices(prices: Price[]): Promise<Price[]> {
        if (prices.length === 0) {
            console.log('No prices to update.');
            return [];
        }

        try {
            console.log(`Updating ${prices.length} prices in Supabase`);
            const { data, error } = await this.supabase
                .from(this.tableName)
                .upsert(prices.map(this.toDbPrice), {
                    onConflict: 'store_pk,item_code', 
                    ignoreDuplicates: false // ברירת מחדל — מעדכן אם קיים
                })
                .select(); 
            if (error) {
                console.error('❌ Error in upsert:', error);
                throw new Error(`Upsert failed: ${error.message}`);
            }

            return data as Price[];
        } catch (error: any) {
            console.error(`Error in updateManyPrices: ${error.message}`);
            throw error;
        }
    }
    async getAllPrices(): Promise<Price[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*');

            if (error) {
                console.error('Error fetching all prices:', error);
                throw new Error(`Failed to fetch prices: ${error.message}`);
            }

            return data || [];
        } catch (error: any) {
            console.error(`Error in getAllPrices: ${error.message}`);
            throw error;
        }
    }

    async getPriceById(priceId: number): Promise<Price | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('price_id', priceId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // Not found
                    return null;
                }
                console.error('Error fetching price by id:', error);
                throw new Error(`Failed to fetch price: ${error.message}`);
            }

            return data;
        } catch (error: any) {
            console.error(`Error in getPriceById: ${error.message}`);
            throw error;
        }
    }

    async deletePriceById(priceId: number): Promise<void> {
        try {
            const { error } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('price_id', priceId);

            if (error) {
                console.error('Error deleting price:', error);
                throw new Error(`Failed to delete price: ${error.message}`);
            }
            console.log(`Price with id ${priceId} deleted successfully.`);
        } catch (error: any) {
            console.error(`Error in deletePriceById: ${error.message}`);
            throw error;
        }
    }
     async getPriceByStorePKItemID(storePK: string, itemCode: string): Promise<Price | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('store_pk', storePK)
                .eq('item_code', itemCode)
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // Not found
                    return null;
                }
                console.error('Error fetching price by storePK and itemCode:', error);
                throw new Error(`Failed to fetch price: ${error.message}`);
            }

            return data;
        } catch (error: any) {
            console.error(`Error in getPriceByStorePKItemCode: ${error.message}`);
            throw error;
        }
    }
     
    async  getStoreItemByName(itemCode: string, storePks: string[]): Promise<Price[]> {
        try {
          const { data, error } = await this.supabase
            .from('price')
            .select('*')
            .eq('item_code', itemCode);
      
          if (error) {
            console.error(`Error fetching prices for itemCode: ${itemCode}`, error);
            return [];
          }
      
          if (!data || data.length === 0) {
            console.log(`Item not found for itemCode: ${itemCode}`);
            return [];
          }
      
          // מסנן רק רשומות שה-store_pk שלהן בתוך storePks
          const filtered = data.filter(row => storePks.includes(row.store_pk));
      
          if (filtered.length === 0) {
            console.log(`No prices found in requested stores for itemCode: ${itemCode}`);
            return [];
          }
      
          // ממפה את הרשומות למבנה Price (בהנחה שיש לך פונקציה כזו)
          const result = filtered.map(this.fromDbToPrice);
      
          return result;
        } catch (e) {
          console.error(`Unexpected error fetching prices for itemCode: ${itemCode}`, e);
          return [];
        }
      }
      
}