//C:\Users\hp326\Documents\תכנות\Smart-cart\smartcart\packages\backend\src\interfaces\Ipromotions.ts

import { IDB } from "../db/IDB";
import { PromotionSummary } from "../services/promotionServices";

export interface IPromotions {
  // getPromotionsByStorePK(storePK: string): Promise<IDB['Promotion']>;

  getPromotionsByStoreId(storePk: string): Promise<IDB['Promotion']>;
  getPromotionsByStoreIdAndItemCode(storePK: string, itemCode: number): Promise<PromotionSummary[]>;
}
