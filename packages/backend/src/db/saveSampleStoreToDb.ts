// src/utils/saveSampleDataToDb.ts

import { Store } from "../../../shared/src/store";
import { StoreRepository } from "./Repositories/storeRepository"; // נתיב מעודכן
import { User } from "../../../shared/src/user";
import { UserRepository } from "./Repositories/userRepository"; // נתיב מעודכן
import { Price } from "../../../shared/src/price";
import { PriceRepository } from "./Repositories/priceRepository"; // נתיב מעודכן
import { Item } from "../../../shared/src/item"; // ייבוא חדש
import { ItemRepository } from "./Repositories/itemRepository"; // ייבוא חדש
import { Promotion } from "../../../shared/src/promotion"; // ייבוא חדש
import { PromotionRepository } from "./Repositories/promotionRepository"; // ייבוא חדש
import { Tag } from "../../../shared/src/tag"; // ייבוא חדש
import { TagRepository } from "./Repositories/tagRepository"; // ייבוא חדש

// הפונקציה יוצרת חנות, יוזר, מחיר, פריט, מבצע ותגית לדוגמה ושומרת אותם ב-DB
export async function saveSampleDataToDb(
  storeRepository: StoreRepository,
  userRepository: UserRepository,
  priceRepository: PriceRepository,
  itemRepository: ItemRepository, // רפוזיטורי חדש
  promotionRepository: PromotionRepository, // רפוזיטורי חדש
  tagRepository: TagRepository // רפוזיטורי חדש
): Promise<{
  store: Store;
  user: User;
  price: Price;
  item: Item;
  promotion: Promotion;
  tag: Tag;
}> {
  // 1. נתוני חנות לדוגמה
  const sampleStore: Store = {
    storeId: 1,
    storeName: "Sample Store",
    address: "123 Main St",
    city: "Tel Aviv",
    chainId: 1,
    subChainId: 1,
    zipCode: "11",
    chainName: "Sample Store Chain",
    subChainName: "Sample Sub Chain",
    // הוסף כאן שדות נוספים לפי המבנה של Store אם יש
  };

  // 2. נתוני יוזר לדוגמה
  const sampleUser: User = {
    userId: 1,
    email: "sample@example.com",
    password: "password123",
    userName: "Sample User",
    // הוסף כאן שדות נוספים לפי המבנה של User אם יש
  };

  // 3. נתוני פריט לדוגמה (Item)
  const sampleItem: Item = {
    itemCode: 123, // קוד פריט שישמש גם במחיר
    itemId: 101,
    itemType: 1, // מספר כפי שהגדרנו
    itemName: "Sample Product A",
    correctItemName: "Sample Product A (Corrected)",
    manufacturerName: "Sample Manufacturer",
    manufactureCountry: "Israel",
    manufacturerItemDescription: "A description of Sample Product A.",
    itemStatus: true, // בוליאני כפי שהגדרנו
    tagsId: [], // נגדיר תגיות בהמשך
  };

  // 4. נתוני מחיר לדוגמה (Price)
  const samplePrice: Price = {
    priceId: 1,
    storeId: 1, // קשור ל-sampleStore
    itemCode: sampleItem.itemCode, // קשור ל-sampleItem
    itemId: sampleItem.itemId,
    price: 9.99,
    priceUpdateDate: new Date("2024-01-01"),
    unitQuantity: "1",
    quantity: 1,
    unitOfMeasure: "unit",
    isWeighted: false,
    quantityInPackage: "1",
    unitOfMeasurePrice: 9.99,
    allowDiscount: true,
    // הוסף כאן שדות נוספים לפי המבנה של Price אם יש
  };

  // 5. נתוני תגית לדוגמה (Tag)
  const sampleTag: Tag = {
    tagId: 1,
    tagName: "Dairy",
    dateAdded: new Date("2024-01-01"), // תאריך הוספה
    isAlreadyScanned: false, // בוליאני כפי שהגדרנו
  };

  // 6. נתוני מבצע לדוגמה (Promotion)
  const samplePromotion: Promotion = {
    promotionId: 1,
    storeId: 1, // קשור ל-sampleStore
    promotionDescription: "Buy one get one free for Sample Product A",
    startDate: new Date("2024-07-01T00:00:00Z"), // תאריך חובה
    endDate: new Date("2024-07-31T23:59:59Z"), // תאריך חובה
    lastUpdated: new Date(), // תאריך חובה, הנוכחי
    isActive: true,
    discountedPrice: 0, // כי זה BOGO
    promotionItemsCode: [sampleItem.itemCode], // קשור ל-sampleItem
    requiresCoupon: false, // חובה
    requiresClubMembership: false, // חובה
    minQuantity: 2,
    additionalGiftCount: 1,
  };

  // שמירה ל-DB
  console.log("Saving sample store...");
  const store = await storeRepository.addStore(sampleStore);
  console.log("Saving sample user...");
  const user = await userRepository.addUser(sampleUser);
  console.log("Saving sample item...");
  const item = await itemRepository.addItem(sampleItem); // שמירת הפריט לפני המחיר והמבצע
  console.log("Saving sample price...");
  const price = await priceRepository.addPrice(samplePrice); // המחיר תלוי בפריט ובחנות
  console.log("Saving sample tag...");
  const tag = await tagRepository.addTag(sampleTag); // שמירת התגית
  console.log("Saving sample promotion...");
  const promotion = await promotionRepository.addPromotion(samplePromotion); // המבצע תלוי בפריט

  // קישור התגית לפריט (אם הפריט כבר נוצר)
  if (item && tag) {
    // --- שורת דיבוג חדשה ---
    console.log(`DEBUG (saveSampleDataToDb): Item Code received: ${item.itemCode}, Tag ID received: ${tag.tagId}`);
    // --- סוף שורת דיבוג חדשה ---

    console.log(`Linking tag ${tag.tagId} to item ${item.itemCode}...`);
    await itemRepository.linkTagToItem(item.itemCode, tag.tagId);
    // ודא שהתגית משתקפת באובייקט ה-item המוחזר
    item.tagsId = item.tagsId ? [...item.tagsId, tag.tagId] : [tag.tagId];
  }

  return { store, user, price, item, promotion, tag };
}