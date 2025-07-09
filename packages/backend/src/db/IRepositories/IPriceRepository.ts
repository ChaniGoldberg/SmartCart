import { Price } from "../../../../shared/src/price";

export interface IPriceRepository {
  addPrice(price: Price): Promise<Price>;
  addManyPrices(prices: Price[]): Promise<Price[]>;
  updatePrice(price: Price): Promise<Price>;
  updateManyPrices(prices: Price[]): Promise<Price[]>;
  getAllPrices(): Promise<Price[]>;
  getPriceById(priceId: number): Promise<Price | null>;
  deletePriceById(priceId: number): Promise<void>;
}