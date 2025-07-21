//C:\Users\hp326\Documents\תכנות\Smart-cart\smartcart\packages\backend\src\interfaces\Ipromotions.ts

import { Promotion } from "@smartcart/shared/src/promotion";
import { PromotionSummary } from "../services/promotionServices";

export interface IPromotions {
  selectPromotionsByStorePK(storePK: string): Promise<Promotion[]>;
  getPromotionsByStoreIdAndItemCode(storePK: string, itemCode: string): Promise<PromotionSummary[]>;
}
