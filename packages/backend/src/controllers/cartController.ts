import { Request, Response } from "express";
import { getProductwithPomotionPrice, getRelevantPromotionsForCart, getStoreItemByName } from "../services/cartService";
import { promotionsService } from "../services/promotionServices";
import { shoppingCartTotalSummary } from "../services/cartService";
import { CartDTO } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import { findStoresWithinRadius } from "../../utils/findStoresWithinRadius";


export const compareCart = async (req: Request, res: Response) => {
  console.log("compareCart called with body:", req.body);
  const { location, userCart} = req.body;

  if (!location || !userCart || !Array.isArray(userCart)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const stores = await findStoresWithinRadius({ latitude: location.latitude, 
      longitude: location.longitude, error: null, loading: false },40);


    const comparisonResults: CartDTO[] = [];
    console.log("Found stores:", stores);
    for (const store of stores) {
      const prices: Price[] = [];

      for (const item of userCart) {

        const {itemName }=item.product ||{}
 
        const priceData=await getStoreItemByName(store.store.storePK,itemName)
        if(!priceData){
           console.log(`המוצר ${itemName}  נמצא בחנות ${store.store.storeName}`);
          continue; 
        }
       
       try {
    
    if (!priceData) {
      console.log(`מוצר ${item.product.itemCode} לא נמצא בסופר ${store.store.storeName}`);
    } else {
      prices.push(priceData);

    }

  } catch (error) {
    console.error(`שגיאה בקבלת מחיר עבור המוצר ${item.product.itemCode} בסופר ${store.store.storeName}`, error);
  }

      }

      const promotions = await promotionsService.selectPromotionsByStorePK(store.store.storePK);
      const relevantPromotions =await getRelevantPromotionsForCart(prices);
      const productsList=await getProductwithPomotionPrice(prices, relevantPromotions);
      const totalPrice = await shoppingCartTotalSummary(productsList);

      comparisonResults.push({
        storeName: store.store.storeName,
        address: store.store.fullAddress,
        products: productsList,
        totalPrice: totalPrice,

      });
    }

    res.status(200).json(comparisonResults);
  } catch (error) {
    console.error('Error comparing cart:', error);
    res.status(500).json({ error: "Server error" });
  }
};

