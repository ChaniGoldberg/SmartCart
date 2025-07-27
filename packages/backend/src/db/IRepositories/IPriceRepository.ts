import { Price } from "@smartcart/shared";

export interface IPriceRepository {
  getAllPrices(): Promise<Price[]>; 
  addPrice(price: Price): Promise<Price>;
  addManyPrices(prices: Price[]): Promise<Price[]>;
  updatePrice(price: Price): Promise<Price>;
  updateManyPrices(prices: Price[]): Promise<Price[]>;
  getPriceById(priceId: number): Promise<Price | null>;
  deletePriceById(priceId: number): Promise<void>;
}

