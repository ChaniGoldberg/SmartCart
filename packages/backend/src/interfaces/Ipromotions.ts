import { IDB } from "../db/IDB";

export interface IPromotions {
  getPromotionsByStoreId(storePK: string): Promise<IDB['Promotion']>;
}