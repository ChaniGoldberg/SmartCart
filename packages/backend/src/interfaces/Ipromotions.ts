import { IDB } from "../db/IDB";

export interface IPromotions {
  getPromotionsByStorePK(storePK: string): Promise<IDB['Promotion']>;
}