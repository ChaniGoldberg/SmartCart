import { Price } from "@smartcart/shared/src/price"
import { db } from "../db/dbProvider";
import { Promotion } from "@smartcart/shared/src/promotion";
import { Item } from "@smartcart/shared/src/item";
import { PriceRepository } from "../db/Repositories/priceRepository";
import { PromotionRepository } from "../db/Repositories/promotionRepository";
import { supabase } from "./supabase";
import { ProductCartDTO } from "@smartcart/shared/src";



const priceRepo=new PriceRepository(supabase)

export async function getPriceByStorePKItemID(storePK: string, itemId: number): Promise<Price | null> {
  const price=await priceRepo.getPriceByStorePKItemID(storePK, itemId)
  if (!price) {
    console.warn(`Price not found for storeId: ${storePK} and itemId: ${itemId}`);
  }

  return price || null;
}


interface PromotionFilterOptions {
  isClubMember?: boolean;
  clubId?: number;
  hasCoupon?: boolean;
  // אפשר להוסיף עוד תנאים בעתיד
}

const promotionRepo = new PromotionRepository(supabase);
export async function getRelevantPromotionsForCart(
  cartItems: Price[],
  options:PromotionFilterOptions={}
){
  const promotionsFromDB = await promotionRepo.getAllPromotions();
  return promotionsFromDB.filter(promo => {
    // בדיקת תוקף
    const now = new Date();
    if (!promo.isActive || now < promo.startDate || now > promo.endDate) return false;

    // בדיקת קופון
    if (promo.requiresCoupon && !options.hasCoupon) return false;

    // בדיקת מועדון
    if (promo.requiresClubMembership) {
      if (!options.isClubMember) return false;
      if (promo.clubId && promo.clubId !== options.clubId) return false;
    }

    // בדיקת מינימום סכום קנייה
    if (promo.minPurchaseAmount) {
      const total = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      if (total < promo.minPurchaseAmount) return false;
    }

    // בדיקת מינימום ומקסימום כמות פריטים במבצע

    if (promo.minQuantity) {
      // סך הכמות של כל הפריטים הרלוונטיים למבצע
      const promoItemsInCart = cartItems.filter(item =>
        promo.promotionItemsCode.includes(item.itemCode)
      );
      const totalPromoQty = promoItemsInCart.reduce((sum, item) => sum + item.quantity, 0);

      if (totalPromoQty < promo.minQuantity || (promo.maxQuantity && totalPromoQty > promo.maxQuantity)) {
        return false;
      }
    }


    // אפשר להוסיף עוד תנאים כאן...

    // אם עבר את כל הבדיקות - המבצע רלוונטי לסל
    return true;
  });
};

export async function shoppingCartTotalSummary(shoppingCart: ProductCartDTO[]): Promise<number> {

  let totalPrice = 0
  for (const item of shoppingCart) {
    totalPrice += item.product.price* item.quantity;
  }
  return totalPrice
}

export async function getItemByItemCode(itemCode: string): Promise<Item | null> {
  const item = db.Item.find(i => i.itemCode === itemCode);
  if (!item) {
    console.warn(`Item not found for itemCode: ${itemCode}`);
    return null;
  }
  return item;
}


export async function getProductwithPomotionPrice(shoppingCart: Price[], promotions: Promotion[]): Promise<ProductCartDTO[]> {

  const productList: ProductCartDTO[] = []
  const relevantPromotions =await getRelevantPromotionsForCart(shoppingCart);
  for (const item of shoppingCart) {
    const promotion = [...relevantPromotions].find(p =>
      p.promotionItemsCode.includes(item.itemCode)
    )

    const itemPrice = promotion?.discountedPrice ?? item.price;
    const itemDetails = await getItemByItemCode(item.itemCode.toString());


    productList.push({
     product : {
        itemCode: item.itemCode,
        priceId:item.priceId,
        ProductName:itemDetails?.itemName ?? "",
        storePK: item.storePK,
        itemName:itemDetails?.itemName ?? "",
        itemStatus: itemDetails?.itemStatus ?? false,
        manufacturerItemDescription:itemDetails?.manufacturerItemDescription ?? "",
        manufacturerName: itemDetails?.manufacturerName ?? "",  
        price: itemPrice,
        unitOfMeasurePrice: item.unitOfMeasurePrice ,
        quantityInPackage: item?.quantityInPackage,
      },
      quantity: item.quantity,

    })

  }

  return productList;

}
