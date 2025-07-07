import { SupabaseClient } from "@supabase/supabase-js";
import { Price } from "../../../../shared/src/price";
import { IPriceRepository } from "../IRepositories/IPriceRepository";

export class PriceRepository implements IPriceRepository {
    private readonly tableName = 'prices';

    constructor(private supabase: SupabaseClient) { }

    // פונקציה להמרה ל-snake_case
    private toDbPrice(price: Price) {
        return {
            price_id: price.priceId,
            // store_uid: price.storeId,
            item_code: price.itemCode,
            item_id: price.itemId,
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

    async updateManyPrices(prices: Price[]): Promise<Price[]> {
        if (prices.length === 0) {
            console.log('No prices to update.');
            return [];
        }

        try {
            console.log(`Updating ${prices.length} prices in Supabase`);
            const updatedPrices: Price[] = [];
            for (const price of prices) {
                const { data, error } = await this.supabase
                    .from(this.tableName)
                    .update(this.toDbPrice(price))
                    .eq('price_id', price.priceId)
                    .select('*');

                if (error) {
                    console.error(`Error updating price with id ${price.priceId}:`, error);
                    throw new Error(`Failed to update price with id ${price.priceId}: ${error.message}`);
                }

                if (!data || data.length === 0) {
                    throw new Error(`No data returned after updating price with id ${price.priceId}.`);
                }

                updatedPrices.push(price);
            }
            console.log(`${updatedPrices.length} prices updated successfully.`);
            return updatedPrices;
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
}