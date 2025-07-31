import { Request, Response } from "express";
import { getProductwithPomotionPrice, getRelevantPromotionsForCart, getStoreItemByName } from "../services/cartService";
import { promotionsService } from "../services/promotionServices";
import { shoppingCartTotalSummary } from "../services/cartService";
import { CartDTO } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import { findStoresWithinRadius } from "../../utils/findStoresWithinRadius";

export const compareCart = async (req: Request, res: Response) => {
  console.log("compareCart called with body:", req.body);
  const { location, userCart } = req.body;

  if (!location || !userCart || !Array.isArray(userCart)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const stores = await findStoresWithinRadius(
      { latitude: location.latitude, longitude: location.longitude, error: null, loading: false },
      10
    );

    const comparisonResults = [];
    const storePKs = stores.map(s => s.store.storePK);

    // שליפת מחירים לכל המוצרים מראש (לכל הסניפים)
    const itemPricesMap = new Map<string, Price[]>(); // key = itemCode

    for (const item of userCart) {
      const itemCode = item.product?.itemCode;
      if (!itemCode) continue;

      if (!itemPricesMap.has(itemCode)) {
        const priceData = await getStoreItemByName(itemCode, storePKs);
        if (!priceData || priceData.length === 0) {
          console.log(`🛑 מוצר ${itemCode} לא נמצא באף סניף`);
          itemPricesMap.set(itemCode, []);
          continue;
        } else {
          itemPricesMap.set(itemCode, priceData);
        }
      }
    }

    // עבור כל חנות - השוואת מחירים ומבצעים
    for (const store of stores) {
      try {
        const prices: Price[] = [];

        // מוצאים את המחיר של כל מוצר בחנות הנוכחית מתוך המפה
        for (const item of userCart) {
          const itemCode = item.product?.itemCode;
          if (!itemCode) continue;
        
          const priceData = itemPricesMap.get(itemCode);
          const storePrice = priceData?.find(p => p.storePK === store.store.storePK);
        
          if (storePrice) {
            // קובע את הכמות על פי מה שהמשתמש הכניס לעגלה
            const itemQuantity = item.quantity ?? 1;
            const storePriceWithQuantity = { ...storePrice, quantity: itemQuantity ,itemName:item.product.itemName??""};
        
            prices.push(storePriceWithQuantity);
            

          }
        }
        // מבצעים רלוונטיים מתוך השירות (אפשר להחליף בהמשך ל-getRelevantPromotionsForCart עם אפשרויות)
        // const promotions = await promotionsService.selectPromotionsByStorePK(store.store.storePK);
        const relevantPromotions = await getRelevantPromotionsForCart(prices);
      

        // מוצרים עם מחיר לאחר מבצעים
        const productsList = await getProductwithPomotionPrice(prices, relevantPromotions,);

        // סכום כולל של כל המוצרים לאחר מבצעים
        const totalPrice = await shoppingCartTotalSummary(productsList);
        if (prices.length > 0 && totalPrice > 0) {
          comparisonResults.push({
            storeName: store.store.storeName,
            address: store.store.fullAddress,
            products: productsList,
            
            totalPrice:totalPrice,
          });
        } else {
          console.log(`❌ החנות ${store.store.storeName} לא מכילה את המוצרים המבוקשים או שהמחיר הכולל הוא אפס.`);
        }
      } catch (error) {
        console.error(`⚠️ שגיאה בעיבוד חנות ${store.store.storeName}:`, error);
        // לא שולחים תשובה כאן, ממשיכים עם שאר החנויות
      }
    }

    // שולחים את התוצאה הכוללת בסיום כל הלולאה
    res.status(200).json(comparisonResults);

  } catch (error) {
    console.error("Error in compareCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
