import { IDB } from "../db/IDB";

export interface IPromotions {
  getPromotionsByStoreId(storeId: number): Promise<IDB['Promotion']>;
}