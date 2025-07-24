import { Price } from "../../../../shared/src/price";

export interface IPriceRepository {
  addPrice(price: Price): Promise<Price>;
  addManyPrices(prices: Price[]): Promise<Price[]>;
  updatePrice(price: Price): Promise<Price>;
upsertManyPrices(prices: Price[]): Promise<Price[]>;
  getPriceById(priceId: number): Promise<Price | null>;
  deletePriceById(priceId: number): Promise<void>;
}