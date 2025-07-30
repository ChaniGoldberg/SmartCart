// src/repositories/promotion.repository.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { IPromotionRepository } from "../IRepositories/IpromotionRepository";
import { Promotion } from "@smartcart/shared";
export class PromotionRepository implements IPromotionRepository {
  private readonly tableName = 'promotion';
  private readonly promotionItemsTableName = 'promotion_items';
  constructor(private supabase: SupabaseClient) {}
  private toDbPromotion(promo: Omit<Promotion, 'promotionItemsCode'>) {
    return {
      promotion_id: promo.promotionId,
      store_pk: promo.storePK,
      promotion_description: promo.promotionDescription,
      start_date: promo.startDate.toISOString(),
      end_date: promo.endDate.toISOString(),
      last_updated: promo.lastUpdated.toISOString(),
      is_active: promo.isActive,
      original_price: promo.originalPrice || null,
      discounted_price: promo.discountedPrice,
      discount_amount: promo.discountAmount || null,
      discount_percentage: promo.discountPercentage || null,
      min_quantity: promo.minQuantity || null,
      max_quantity: promo.maxQuantity || null,
      requires_coupon: promo.requiresCoupon,
      requires_club_membership: promo.requiresClubMembership,
      club_id: promo.clubId || null,
      additional_gift_count: promo.additionalGiftCount || null,
      min_purchase_amount: promo.minPurchaseAmount || null,
      min_number_of_items_offered: promo.minNumberOfItemOfered || null,
      remarks: promo.remarks || null,
    };
  }
  async linkItemToPromotion(promotionId: number, itemCode: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.promotionItemsTableName)
      .insert({ promotion_id: promotionId, item_code: itemCode });
    if (error && error.code !== '23505') throw new Error(`Failed to link item to promotion: ${error.message}`);
  }
  async unlinkItemFromPromotion(promotionId: number, itemCode: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.promotionItemsTableName)
      .delete()
      .eq('promotion_id', promotionId)
      .eq('item_code', itemCode);
    if (error) throw new Error(`Failed to unlink item from promotion: ${error.message}`);
  }
  async getPromotionsByStoreIdAndItemCode(storePK: string, itemCode: string): Promise<Promotion[]> {
    const { data: promotions, error: promotionsError } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('store_pk', storePK);
    if (promotionsError || !promotions) return [];
    const promotionIds = promotions.map(p => p.promotion_id);
    const { data: promotionItems, error: promotionItemsError } = await this.supabase
      .from(this.promotionItemsTableName)
      .select('promotion_id, item_code')
      .in('promotion_id', promotionIds)
      .eq('item_code', itemCode);
    if (promotionItemsError || !promotionItems) return [];
    const matchingPromotionIds = new Set(promotionItems.map(p => p.promotion_id));
    return promotions
      .filter(p => matchingPromotionIds.has(p.promotion_id))
      .map(p => ({
        ...p,
        startDate: new Date(p.start_date),
        endDate: new Date(p.end_date),
        lastUpdated: new Date(p.last_updated),
        promotionItemsCode: promotionItems.filter(i => i.promotion_id === p.promotion_id).map(i => i.item_code),
      }));
  }
  async setItemsForPromotion(promotionId: number, itemCodes: string[]): Promise<void> {
    await this.supabase.from(this.promotionItemsTableName).delete().eq('promotion_id', promotionId);
    if (itemCodes.length > 0) {
      const newLinks = itemCodes.map(itemCode => ({ promotion_id: promotionId, item_code: itemCode }));
      const { error } = await this.supabase.from(this.promotionItemsTableName).insert(newLinks);
      if (error) throw new Error(`Failed to set new items for promotion: ${error.message}`);
    }
  }
  async addPromotion(promotion: Promotion): Promise<Promotion> {
    const { promotionItemsCode, ...promoToInsert } = promotion;
    const { data, error } = await this.supabase.from(this.tableName).insert([this.toDbPromotion(promoToInsert)]).select('*');
    if (error || !data || data.length === 0) throw new Error('Failed to add promotion.');
    const addedPromotionDb = data[0];
    if (promotionItemsCode?.length) {
      await this.setItemsForPromotion(addedPromotionDb.promotion_id, promotionItemsCode);
    }
    return { ...addedPromotionDb, promotionItemsCode: promotionItemsCode || [] } as Promotion;
  }
  async addManyPromotions(promotions: Promotion[]): Promise<Promotion[]> {
    const dbPromotionsToInsert = promotions.map(({ promotionItemsCode, ...rest }) => this.toDbPromotion(rest));
    const { data, error } = await this.supabase.from(this.tableName).insert(dbPromotionsToInsert).select('*');
    if (error || !data) throw new Error('Failed to add multiple promotions.');
    for (const promotion of promotions) {
      if (promotion.promotionItemsCode?.length) {
        await this.setItemsForPromotion(promotion.promotionId, promotion.promotionItemsCode);
      }
    }
    return promotions;
  }
  async updatePromotion(promotion: Promotion): Promise<Promotion> {
    const { promotionItemsCode, ...promoToUpdate } = promotion;
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(this.toDbPromotion(promoToUpdate))
      .eq('promotion_id', promotion.promotionId)
      .select('*');
    if (error || !data || data.length === 0) throw new Error('Failed to update promotion.');
    const updatedDbPromotion = data[0];
    if (promotionItemsCode !== undefined) {
      await this.setItemsForPromotion(promotion.promotionId, promotionItemsCode);
    }
    return { ...updatedDbPromotion, promotionItemsCode: promotionItemsCode || [] } as Promotion;
  }
  async updateManyPromotions(promotions: Promotion[]): Promise<Promotion[]> {
    const promotionItems = promotions.flatMap(p => p.promotionItemsCode.map(code => ({ promotion_id: p.promotionId, item_code: code })));
    const { data, error } = await this.supabase
      .from(this.tableName)
      .upsert(promotions.map(p => this.toDbPromotion(p)), { onConflict: 'promotion_id' })
      .select('*');
    if (error) throw error;
    const promotionIds = promotions.map(p => p.promotionId);
    await this.supabase.from('promotion_items').delete().in('promotion_id', promotionIds);
    if (promotionItems.length > 0) {
      await this.supabase.from('promotion_items').upsert(promotionItems, { onConflict: 'promotion_id,item_code' });
    }
    return promotions;
  }
  async upsertManyPromotions(promotions: Promotion[]): Promise<void> {
    const promotionItems = promotions.flatMap(p => p.promotionItemsCode.map(code => ({ promotion_id: p.promotionId, item_code: code })));
    await this.supabase.from(this.tableName).upsert(promotions.map(p => this.toDbPromotion(p)), { onConflict: 'promotion_id' });
    const promotionIds = promotions.map(p => p.promotionId);
    await this.supabase.from('promotion_items').delete().in('promotion_id', promotionIds);
    if (promotionItems.length > 0) {
      await this.supabase.from('promotion_items').upsert(promotionItems, { onConflict: 'promotion_id,item_code' });
    }
  }
  async getAllPromotions(): Promise<Promotion[]> {
    const { data, error } = await this.supabase.from(this.tableName).select('*');
    if (error || !data) return [];
    const { data: promotionItemsData } = await this.supabase.from(this.promotionItemsTableName).select('promotion_id,item_code');
    const promotionItemsMap = new Map<number, string[]>();
    promotionItemsData?.forEach(row => {
      if (!promotionItemsMap.has(row.promotion_id)) promotionItemsMap.set(row.promotion_id, []);
      promotionItemsMap.get(row.promotion_id)?.push(row.item_code);
    });
    return data.map(dbPromo => ({
      ...dbPromo,
      startDate: new Date(dbPromo.start_date),
      endDate: new Date(dbPromo.end_date),
      lastUpdated: new Date(dbPromo.last_updated),
      promotionItemsCode: promotionItemsMap.get(dbPromo.promotion_id) || []
    }));
  }
  async getPromotionById(promotionId: number): Promise<Promotion | null> {
    const { data, error } = await this.supabase.from(this.tableName).select('*').eq('promotion_id', promotionId).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to fetch promotion: ${error.message}`);
    const itemCodes = await this.getItemsByPromotionId(promotionId);
    return {
      ...data,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      lastUpdated: new Date(data.last_updated),
      promotionItemsCode: itemCodes,
    } as Promotion;
  }
  async SelectPromotionsByStorePK(storePK: string): Promise<Promotion[]> {
    const today = new Date().toISOString();
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('store_pk', storePK)
      .lte('start_date', today)
      .gte('end_date', today);
    if (error) throw new Error(`Failed to fetch promotions: ${error.message}`);
    return data as Promotion[];
  }
  async getPromotionsByStorePK(storePK: string): Promise<Promotion[]> {
    const { data, error } = await this.supabase.from(this.tableName).select('*').eq('store_pk', storePK);
    if (error || !data) return [];
    const promotionIds = data.map(p => p.promotion_id);
    const { data: promotionItemsData } = await this.supabase.from(this.promotionItemsTableName).select('promotion_id,item_code').in('promotion_id', promotionIds);
    const promotionItemsMap = new Map<number, string[]>();
    promotionItemsData?.forEach(row => {
      if (!promotionItemsMap.has(row.promotion_id)) promotionItemsMap.set(row.promotion_id, []);
      promotionItemsMap.get(row.promotion_id)?.push(row.item_code);
    });
    return data.map(dbPromo => ({
      ...dbPromo,
      startDate: new Date(dbPromo.start_date),
      endDate: new Date(dbPromo.end_date),
      lastUpdated: new Date(dbPromo.last_updated),
      promotionItemsCode: promotionItemsMap.get(dbPromo.promotion_id) || []
    })) as Promotion[];
  }
  async deletePromotionById(promotionId: number): Promise<void> {
    await this.supabase.from(this.promotionItemsTableName).delete().eq('promotion_id', promotionId);
    const { error } = await this.supabase.from(this.tableName).delete().eq('promotion_id', promotionId);
    if (error) throw new Error(`Failed to delete promotion: ${error.message}`);
  }
  async getItemsByPromotionId(promotionId: number): Promise<string[]> {
    const { data, error } = await this.supabase
      .from(this.promotionItemsTableName)
      .select('item_code')
      .eq('promotion_id', promotionId);
    if (error) throw error;
    return data?.map((item) => item.item_code) ?? [];
  }
}