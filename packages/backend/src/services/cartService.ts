import { Price } from "@smartcart/shared/src/price"
import { db } from "../db/dbProvider";
import { ProductDTO } from "@smartcart/shared";
export async function getPriceByStoreIDItemID(storePK: String, itemId: Number): Promise<Price | null> {
  const price = db.Price.find(p => p.storePK == storePK && p.itemId == itemId)

  if (!price) {
    console.warn(`Price not found for storeId: ${storePK} and itemId: ${itemId}`);
  }

  return price || null;
}


// export async function getRelevantPromotionsForCart


import { Promotion } from "@smartcart/shared/src/promotion";
import { Item } from "@smartcart/shared/src/item";
// import { Price } from "@smartcart/shared/src/price";


interface PromotionFilterOptions {
  isClubMember?: boolean;
  clubId?: number;
  hasCoupon?: boolean;
  // אפשר להוסיף עוד תנאים בעתיד
}

export function getRelevantPromotionsForCart(
  cartItems: Price[],
  promotions: Promotion[],
  options: undefined | PromotionFilterOptions = {}
): Promotion[] {
  return promotions.filter(promo => {
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
        promo.promotionItemsCode.includes(item.itemId)
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

export async function shoppingCartTotalSummary(shoppingCart: ProductDTO[], promotions: Promotion[]): Promise<number> {

  let totalPrice = 0

  for (const item of shoppingCart) {
    let promotion: Promotion | undefined = undefined
    for (let i = promotions.length - 1; i >= 0; i--) {
      const promo = promotions[i];
      if (!promo.isActive) continue;
      if (!promo.promotionItemsCode.includes(item.itemCode)) { 
        promotion = promo;
        break;
      }
    }
    const itemPrice = promotion && promotion.discountedPrice
      ? promotion.discountedPrice
      : item.price;

    totalPrice += itemPrice;
  }
  return totalPrice
}