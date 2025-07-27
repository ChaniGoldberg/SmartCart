import { Request, Response } from "express";
import { getValidStores } from "../services/storeService";
import { getPriceByStorePKItemID, getProductwithPomotionPrice, getRelevantPromotionsForCart } from "../services/cartService";
import { promotionsService } from "../services/promotionServices";
import { shoppingCartTotalSummary } from "../services/cartService";
import { CartDTO, ProductCartDTO, ProductDTO } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import { findStoresWithinRadius } from "../../utils/findStoresWithinRadius";


export const compareCart = async (req: Request, res: Response) => {
  console.log("compareCart called with body:", req.body);
  const { location, cartItems} = req.body;

  // שלב 1: בדיקת קלט
  if (!location || !cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // שלב 2: קבלת רשימת הסניפים
    const stores = await findStoresWithinRadius(location,300);
    
    const comparisonResults: CartDTO[] = [];
    console.log("Found stores:", stores);
    // שלב 3: עבור כל סופרמרקט
    for (const store of stores) {
      const prices: Price[] = [];

      // שלב 4: עבור כל פריט בסל הקניות
      for (const item of cartItems) {
        // שלב 5: קבלת המחיר עבור פריט וסופרמרקט
        const priceData = await getPriceByStorePKItemID(store.store.storePK, item.itemId);
        console.log(`Price for item ${item.itemId} in store ${store.store.storePK}:`, priceData);

        if (priceData) {
          prices.push(priceData);
          // שלב 6: קבלת המבצעים עבור פריט וסופרמרקט


        }
      }

      const promotions = await promotionsService.selectPromotionsByStorePK(store.store.storePK);
      const relevantPromotions =await getRelevantPromotionsForCart(prices);
      // הוספת פרטי הפריט עם המחיר והמבצעים
      const productsList=await getProductwithPomotionPrice(prices, relevantPromotions);

      // שלב 7: חישוב מחיר כולל של הסל
      const totalPrice = await shoppingCartTotalSummary(productsList);

      // שלב 8: הוסף את התוצאות עבור הסופרמרקט הנוכחי
      comparisonResults.push({
        storeName: store.store.storeName,
        address: store.store
        .fullAddress,
        products: productsList,
        totalPrice: totalPrice,
      
      });
    }

    // שלב 9: החזרת התוצאות
    res.status(200).json(comparisonResults);
  } catch (error) {
    console.error('Error comparing cart:', error);
    res.status(500).json({ error: "Server error" });
  }
};


