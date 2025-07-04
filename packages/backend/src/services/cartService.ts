import { Price } from "@smartcart/shared/src/price"
import { db } from "../db/dbProvider";

export async function getPriceByStoreIDItemID(storeId:Number,itemId:Number):Promise<Price | null>{
  const price=db.Price.find(p=>p.storeId==storeId && p.itemId==itemId)
  
  if (!price) {
        console.warn(`Price not found for storeId: ${storeId} and itemId: ${itemId}`);
    } 
  
  return price || null;
}

