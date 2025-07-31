import { Price } from "@smartcart/shared";

export interface IPriceRepository {
  getAllPrices(): Promise<Price[]>; 
  addPrice(price: Price): Promise<Price>;
  addManyPrices(prices: Price[]): Promise<Price[]>;
  updatePrice(price: Price): Promise<Price>;

  upsertManyPrices(prices: Price[]): Promise<Price[]>;
  getPriceById(priceId: number): Promise<Price | null>;
  deletePriceById(priceId: number): Promise<void>;
     // *** הוסף את השורה הבאה ***
    getAllPrices(): Promise<Price[]>;
    // *** הוסף גם את זו, שראיתי במימוש ששלחת:
    getPriceByStorePKItemID(storePK: string, itemCode: string): Promise<Price | null>;
    getStoreItemByName(itemCode: string, storePks: string[]): Promise<Price[]>
}

