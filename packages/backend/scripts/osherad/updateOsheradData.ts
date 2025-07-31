
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import { connectAndListFileNames } from './getOsherAdFileUrl';
import { getLatestPriceFilesPerStore } from './PriceUtils';
import { getLatestPromoFilesPerStore } from './promoUtils';
import { getMostUpdatedStroeFile } from './storeUtils';
import { downloadFileWithZip } from './downloadFile';
import { parsePriceFullXmlToItemJson } from './parsePriceFullXmlToItemJson';
import { parsePriceFullXmlToPriceJson } from './parsePriceFullToPriceJson';
import { parseXmlPromotionsToJson } from './parseXMLPromosFullToJsonFile';
import { parseStoresXmlFileToStores } from './parse_stores';

import { Price } from "@smartcart/shared/src/price";
import { Item } from "@smartcart/shared/src/item";
import { PriceRepository } from "../../src/db/Repositories/priceRepository";
import { PromotionRepository } from "../../src/db/Repositories/promotionRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Promotion } from "@smartcart/shared/src/promotion";
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import { supabase } from "../../src/services/supabase";

import { Client } from "basic-ftp";
import { StoreRepository } from '../../src/db/Repositories/storeRepository';
import { limitConcurrency,geocodeAddress } from '../../src/services/storeService';
import { Store } from '@smartcart/shared';



// נתיבים לתיקיות
const storeDir = path.resolve(__dirname, 'DownloadsStoreFile');
const promoDir = path.resolve(__dirname, 'UpdatedPromotionFiles');
const priceDir = path.resolve(__dirname, 'UpdatedPriceFiles');

// --- פונקציות עזר מרכזיות ---

//סורקת באצים של ובודקת מי מהם כבר קיים במסד נתונים


export async function filterPromotionsWithOnlyExistingItems(
  supabase: SupabaseClient,
  promotions: Promotion[],
  batchSize = 500
): Promise<Promotion[]> {
  const allCodes = new Set(promotions.flatMap(p => p.promotionItemsCode));
  const allCodesArray = Array.from(allCodes);
  const existingItems: Array<{ item_code: string }> = [];

  for (let i = 0; i < allCodesArray.length; i += batchSize) {
    const batch = allCodesArray.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('item')
      .select('item_code')
      .in('item_code', batch);

    if (error) {
      throw new Error(`Error fetching existing items: ${error.message}`);
    }
    existingItems.push(...(data ?? []));
  }

  const existingSet = new Set(existingItems.map(i => i.item_code));

  return promotions.map(p => ({
    ...p,
    promotionItemsCode: p.promotionItemsCode.filter(code => existingSet.has(code)),
  }));
}

export async function clearFolder(folderPath: string): Promise<void> {
  try {
    await fs.promises.mkdir(folderPath, { recursive: true }); // תוודא שהתיקיה קיימת, ואם לא – תיצור
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.lstat(filePath);
      if (stat.isFile()) {
        await fs.promises.unlink(filePath);
      }
    }
  } catch (err) {
    console.error("❌ שגיאה בניקוי תיקיה:", err);
    throw err;
  }
}
// פונקציה לניקוי כפילויות במחירים
function removeDuplicatePrices(prices: Price[]): Price[] {
  const seen = new Set<string>();
  const unique: Price[] = [];
  for (const p of prices) {
    const key = `${p.storePK}-${p.itemCode}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  }
  const duplicatesCount = prices.length - unique.length;
  if (duplicatesCount > 0) {
    console.warn(`⚠️ נמצאו ${duplicatesCount} כפילויות בקובץ – הן הוסרו לפני UPSERT`);
  }
  return unique;
}
// פונקציה לשמירת מחירים למסד נתונים
export async function saveAllPricesToDb(
  dictionaryPrices: Map<string, Price[]>,
  priceRepo: PriceRepository
): Promise<void> {
  const BATCH_SIZE = 100;
  for (const [fileName, prices] of dictionaryPrices.entries()) {
    try {
      if (!prices.length) {
        console.log(`⚠️ לא נמצאו מחירים בקובץ: ${fileName}`);
        continue;
      }
      console.log(`מעבד ${prices.length} מחירים מהקובץ: ${fileName}`);
      let totalUpserted = 0;
      for (let i = 0; i < prices.length; i += BATCH_SIZE) {
        const batch = prices.slice(i, i + BATCH_SIZE);
        // ניקוי כפילויות באותו באץ'
        const uniqueBatch = removeDuplicatePrices(batch);

        console.log(`UPSERT ${uniqueBatch.length} prices to Supabase`);
        const upserted = await priceRepo.upsertManyPrices(uniqueBatch);
        totalUpserted += upserted.length;
        console.log(`✅ נשמרו ${upserted.length} מחירים בבאטצ' ${i / BATCH_SIZE + 1}`);
      }

      console.log(`✅ סיום עיבוד קובץ ${fileName}. סה"כ נשמרו ${totalUpserted} מחירים`);
    } catch (err) {
      console.error(`❌ שגיאה בשמירת מחירים מקובץ ${fileName}:`, err);
    }
  }
}
// פונקציה לניקוי כפילויות בפריטים
export function removeDuplicateItems(items: Item[]): Item[] {
  const map = new Map<string, Item>();
  for (const item of items) {
    // נשמור רק את הפריט האחרון שמופיע בקובץ עבור אותו itemCode
    map.set(item.itemCode, item);
  }
  return Array.from(map.values());
}

//שומרת פריטים חדשים ומעודכנים מתוך הקבצים למסד נתונים
export async function saveAllItemsToDb(
  dictionaryItems: Map<string, Item[]>,
  itemRepo: ItemRepository
): Promise<void> {
  const BATCH_SIZE = 100;
  for (const [fileName, items] of dictionaryItems.entries()) {
    try {
      if (!items.length) {
        console.log(`⚠️ לא נמצאו פריטים בקובץ: ${fileName}`);
        continue;
      }
      const filteredItems = items.filter(i => i.itemCode && i.itemCode !== "0");
      if (!filteredItems.length) {
        console.log(`⚠️ כל הפריטים בקובץ ${fileName} לא חוקיים (itemCode חסר או 0), מדלגת`);
        continue;
      }
      // ניקוי כפילויות
      const uniqueItems = removeDuplicateItems(filteredItems);
      console.log(
        `📝 מבצעת UPSERT של ${uniqueItems.length} פריטים (לאחר ניקוי כפילויות) מהקובץ ${fileName}`
      );

      for (let i = 0; i < uniqueItems.length; i += BATCH_SIZE) {
        const batch = uniqueItems.slice(i, i + BATCH_SIZE);
        await itemRepo.upsertManyItems(batch);
        console.log(`✅ באץ' ${i / BATCH_SIZE + 1} נשמר בהצלחה`);
      }
    } catch (err) {
      console.error(`❌ שגיאה בשמירת פריטים מקובץ ${fileName}:`, err);
    }
  }
}
//פונקציה שמסננת רק את המבצעים עם פריטים קיימים במסד

// פונקציה לשמירת מבצעים למסד נתונים
export async function saveAllPromotionsToDb(
  promotionMap: Map<string, Promotion[]>,
  repo: PromotionRepository,
  supabaseClient: SupabaseClient,
  batchSize = 100
): Promise<void> {
  for (const [fileName, promotions] of promotionMap.entries()) {
    if (!promotions.length) {
      console.log(`⚠️ אין מבצעים בקובץ ${fileName}`);
      continue;
    }
    // חותכים לבאטצ'ים ומבצעים UPSERT ישירות
    for (let i = 0; i < promotions.length; i += batchSize) {
      const batch = promotions.slice(i, i + batchSize);
      try {
        await repo.upsertManyPromotions(batch);
        console.log(`UPSERT ${batch.length} מבצעים מקובץ ${fileName} (באטצ' ${i / batchSize + 1})`);
      } catch (err: any) {
        console.error(`❌ שגיאה ב-UPSERT מקובץ ${fileName}, באטצ' ${i / batchSize + 1}:`, err.message);
      }
    }
  }
}

// --- הקוד המרכזי שמריץ את התהליך ---

async function main() {
  const client = new Client();

  await client.access({
    host: "url.publishedprices.co.il",
    user: "osherad",
    password: "",
    secure: false,
  });

  // יצירת תיקיות במידת הצורך
  for (const dir of [storeDir, promoDir, priceDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }


  await clearFolder(storeDir);
  await clearFolder(promoDir);
  await clearFolder(priceDir);
  console.log('✅ תיקיות נקיות ומוכנות לעבודה');

  console.log('📥 מתחבר ל־FTP ומביא את רשימת הקבצים...');
  const fileNames = await connectAndListFileNames();

  // קבלת הקבצים המעודכנים בלבד
  const priceFiles = getLatestPriceFilesPerStore(fileNames);
  const promoFiles = getLatestPromoFilesPerStore(fileNames);
  const storeFile = getMostUpdatedStroeFile(fileNames);
 
// *** Stores ***
if (storeFile) {
  console.log(`⬇️ מוריד Stores: ${storeFile}`);

  await downloadFileWithZip(client, storeFile, storeDir);

  const downloadedPath = path.join(storeDir, storeFile);
  if (!fs.existsSync(downloadedPath)) {
    console.error("❌ לא נמצא קובץ Stores אחרי הורדה");
    return;
  }

  const stores = await parseStoresXmlFileToStores(downloadedPath.toString());
  const storeRepo = new StoreRepository(supabase);

  if (!stores || stores.length === 0) {
    console.warn(`❌ לא נמצאו חנויות בקובץ: ${storeFile}`);
    return;
  }

  // שליפת חנויות קיימות ממסד הנתונים
  const existingStores = await storeRepo.getAllStoresMinimal();
  const existingCoordsMap = new Map(
    existingStores.map(store => [store.store_pk, { lat: store.latitude, lng: store.longitude }])
  );

  // סינון חנויות שדורשות קואורדינטות
  const storesNeedingCoords = stores.filter(store => {
    const existing = existingCoordsMap.get(store.storePK);
    return !existing || !existing.lat || !existing.lng;
  });

  const failedStores: { storePK: string, name: string, address: string, city: string }[] = [];

  // נסיון להשלמת קואורדינטות
  await limitConcurrency(storesNeedingCoords, async (store) => {
    const fullAddress = `${store.address}, ${store.city}`;
    const coords = await geocodeAddress(fullAddress);
    if (coords) {
      store.latitude = coords.lat;
      store.longitude = coords.lng;
    } else {
      failedStores.push({
        storePK: store.storePK,
        name: store.storeName,
        address: store.address,
        city: store.city,
      });
    }
  }, 10);

  for (const store of stores) {
    const existing = existingCoordsMap.get(store.storePK);
    if ((!store.latitude || !store.longitude) && existing?.lat && existing?.lng) {
      store.latitude = existing.lat;
      store.longitude = existing.lng;
    }
  }
  // הכנסת כל החנויות עם upsert
  await storeRepo.addManyStores(stores);

  console.log(`✅ סיום עיבוד והוספת חנויות מקובץ ${storeFile}`);

  // דיווח על חנויות שלא נמצאו להן קואורדינטות
  if (failedStores.length > 0) {
    console.warn(`⚠️ ${failedStores.length} חנויות לא נמצאו להן קואורדינטות:`);
    console.table(failedStores);
  }

}

//   *** Price ***
// //  *** Price ***
 for (const fileName of priceFiles) {
  console.log(`⬇️ מוריד Price: ${fileName}`);

  await downloadFileWithZip(client, fileName, priceDir);

  const xmlFilePath = path.join(priceDir, path.basename(fileName, path.extname(fileName)) + ".xml");

  if (!fs.existsSync(xmlFilePath)) {
    console.warn(`❌ לא נמצא קובץ XML אחרי חילוץ של: ${fileName}, מדלג`);
    continue;
  }

  // קריאת פריטים
  const items = await parsePriceFullXmlToItemJson(xmlFilePath);
  const itemRepo = new ItemRepository(supabase);
  await saveAllItemsToDb(new Map([[fileName, items]]), itemRepo);

  // קריאת מחירים
  const prices = await parsePriceFullXmlToPriceJson(xmlFilePath);
  const priceRepo = new PriceRepository(supabase);
  await saveAllPricesToDb(new Map([[fileName, prices]]), priceRepo);
}


// *** Promo ***

// בתוך הלולאה שמטפלת בקבצי Promo:
for (const fileName of promoFiles) {
  console.log(`⬇️ מוריד Promo: ${fileName}`);

  await downloadFileWithZip(client, fileName, promoDir);
  console.log("📂 קבצים בתיקיית promoDir:", promoDir);
  
  const xmlFilePath = path.join(promoDir, path.basename(fileName, path.extname(fileName)) + ".xml");
  const rawContent = fs.readFileSync(xmlFilePath, 'utf8');
  
  console.log('Start of XML file:', rawContent.substring(0, 100));
  

  if (!fs.existsSync(xmlFilePath)) {
    console.warn(`❌ לא נמצא קובץ XML אחרי חילוץ של: ${fileName}, מדלג`);
    continue;
  }
 
  const promotions = await parseXmlPromotionsToJson(rawContent);

  const promotionRepo = new PromotionRepository(supabase);
  if (!promotions || promotions.length === 0) {
    console.warn(`❌ לא נמצאו מבצעים בקובץ: ${fileName}`);
    continue;
  }
  // כאן הסינון לפי פריטים קיימים:
  const filteredPromotions = await filterPromotionsWithOnlyExistingItems(supabase, promotions);
console.log( JSON.stringify(filteredPromotions, null, 2));

  await saveAllPromotionsToDb(new Map([[fileName, filteredPromotions]]), promotionRepo, supabase);
}





  console.log('✅ תהליך אושר עד הושלם בהצלחה!');
  client.close();
}

main().catch(err => {
  console.error('❌ שגיאה בתהליך:', err);
});
