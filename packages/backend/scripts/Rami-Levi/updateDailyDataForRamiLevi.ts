import { parseStoresXmlFileToStores } from "./parseXmlStoreToJson";
import fs from 'fs/promises';
import { Item } from '@smartcart/shared/src/item';
import getMostUpdate from "./getMostUpdate";
import { ReturnsTheMostUpToDatePromotionsFile } from "./LastFilePromotions";
import { Store } from "@smartcart/shared/src/store";
import { parseXmlPromotionsToJson, parseXmlToJson } from "./convertXMLPromotionFileToJson";
import cron from 'node-cron';
import getMostUpdateStoresFile from "./getMostUpdateStoresFile";
import * as path from "path";
import { Client } from "basic-ftp";
import { connectAndListFiles } from "./connect-rami-levi";
import { downloadFileWithZip } from "./downloadFile";
import { createClient } from "@supabase/supabase-js";
import { parsePriceFullXmlToItemJson } from "./parsePriceFullXmlToItemJson";
import { Price } from "@smartcart/shared/src/price";
import { parsePriceFullXmlToPriceJson } from "./parsePriceFullXmlToPriceJson";
import { Promotion } from "@smartcart/shared/src/promotion";
import { ItemRepository } from "../../src/db/Repositories/itemRepository";

import dotenv from 'dotenv';
import { PriceRepository } from "../../src/db/Repositories/priceRepository";
dotenv.config();
//סורקת באצים של ובודקת מי מהם כבר קיים במסד נתונים
async function getExistingItemCodesInBatches(
  supabase: any,
  itemCodes: string[],
  batchSize = 100
): Promise<Set<string>> {
  const existingItemCodesSet = new Set<string>();
  for (let i = 0; i < itemCodes.length; i += batchSize) {
    const batch = itemCodes.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('item')
      .select('item_code')
      .in('item_code', batch);
    if (error) {
      throw new Error(`שגיאה בבדיקת פריטים קיימים: ${error.message}`);
    }
    if (data) {
      data.forEach((row: { item_code: string }) => existingItemCodesSet.add(row.item_code));
    }
  }
  return existingItemCodesSet;
}
// מוסיפה את הפריטים למסד הנתונים בקבוצות (Batches) דרך itemRepository, כדי לשפר ביצועים ולמנוע עומס
async function addItemsInBatches(
  itemRepository: ItemRepository,
  items: Item[],
  batchSize = 100
): Promise<Item[]> {
  const allAddedItems: Item[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    try {
      const addedItems = await itemRepository.addManyItems(batch);
      allAddedItems.push(...addedItems);
      console.log(`Batch ${i / batchSize + 1} inserted successfully`);
    } catch (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      throw error;
    }
  }

  return allAddedItems;
}
// מעדכנת את הפריטים למסד הנתונים בקבוצות (Batches) דרך itemRepository, כדי לשפר ביצועים ולמנוע עומס
async function updateItemsInBatches(
  itemRepository: ItemRepository,
  items: Item[],
  batchSize = 100
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    try {
      await itemRepository.updateManyItems(batch);
      console.log(`📝 Batch ${i / batchSize + 1} updated successfully`);
    } catch (error) {
      console.error(`❌ Error updating batch ${i / batchSize + 1}:`, error);
      throw error;
    }
  }
}
// פונקציה לקבלת priceCodes קיימים בבאטצ'ים
async function getExistingPriceIdsInBatches(
  supabase: any,
  priceIds: number[],
  batchSize = 100
): Promise<Set<number>> {
  const existingPriceIdsSet = new Set<number>();

  for (let i = 0; i < priceIds.length; i += batchSize) {
    const batch = priceIds.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('price')
      .select('price_id') // ודאי שזה שם השדה בטבלה
      .in('price_id', batch);

    if (error) {
      throw new Error(`שגיאה בבדיקת מחירים קיימים: ${error.message}`);
    }

    if (data) {
      data.forEach((row: { price_id: number }) =>
        existingPriceIdsSet.add(row.price_id)
      );
    }
  }

  return existingPriceIdsSet;
}

// פונקציה להוספת מחירים ב־batch
async function addPricesInBatches(
  priceRepository: PriceRepository,
  prices: Price[],
  batchSize = 100
): Promise<Price[]> {
  const allAddedPrices: Price[] = [];
  for (let i = 0; i < prices.length; i += batchSize) {
    const batch = prices.slice(i, i + batchSize);
    const added = await priceRepository.addManyPrices(batch);
    allAddedPrices.push(...added);
    console.log(`Batch ${i / batchSize + 1} of prices inserted successfully`);
  }
  return allAddedPrices;
}

// פונקציה לעדכון מחירים ב־batch
async function updatePricesInBatches(
  priceRepository: PriceRepository,
  prices: Price[],
  batchSize = 100
): Promise<void> {
  for (let i = 0; i < prices.length; i += batchSize) {
    const batch = prices.slice(i, i + batchSize);
    await priceRepository.updateManyPrices(batch);
    console.log(`Batch ${i / batchSize + 1} of prices updated successfully`);
  }
}
export async function saveAllPricesToDb(
  dictionaryPrices: Map<string, Price[]>,
  priceRepo: PriceRepository
): Promise<void> {
  for (const [fileName, prices] of dictionaryPrices.entries()) {
    try {
      if (!prices.length) {
        console.log(`⚠️ לא נמצאו מחירים בקובץ: ${fileName}`);
        continue;
      }
      // סינון מחירים חוקיים (למשל priceCode לא ריק)
      const filteredPrices = prices.filter(p => p.priceId && p.priceId !== 0);
      if (!filteredPrices.length) {
        console.log(`⚠️ כל המחירים בקובץ ${fileName} לא חוקיים (priceId חסר או 0), מדלגת`);
        continue;
      }

      const supabaseClient = (priceRepo as any)['supabase'];
      const existingPriceIdsSet = await getExistingPriceIdsInBatches(
  supabaseClient,
  filteredPrices.map(p => p.priceId),
  100
);

// חלוקה למחירים לעדכון וחדשים להוספה
const toUpdate = filteredPrices.filter(p => existingPriceIdsSet.has(p.priceId));
const toInsert = filteredPrices.filter(p => !existingPriceIdsSet.has(p.priceId));

      if (toUpdate.length > 0) {
        console.log(`מעדכן ${toUpdate.length} מחירים קיימים ב-Supabase`);
        await updatePricesInBatches(priceRepo, toUpdate, 100);
      } else {
        console.log("אין מחירים לעדכן");
      }
      if (toInsert.length > 0) {
        const inserted = await addPricesInBatches(priceRepo, toInsert, 100);
        console.log(`✅ נוספו ${inserted.length} מחירים חדשים מתוך הקובץ: ${fileName}`);
      } else {
        console.log(`ℹ️ אין מחירים חדשים להוספה מתוך הקובץ: ${fileName}`);
      }
    } catch (err) {
      console.error(`❌ שגיאה בשמירת מחירים מקובץ ${fileName}:`, err);
    }
  }
}

//שומרת פריטים חדשים ומעודכנים מתוך הקבצים למסד נתונים
export async function saveAllItemsToDb(
  dictionaryItems: Map<string, Item[]>,
  itemRepo: ItemRepository
): Promise<void> {
  for (const [fileName, items] of dictionaryItems.entries()) {
    try {
      if (!items.length) {
        console.log(`⚠️ לא נמצאו פריטים בקובץ: ${fileName}`);
        continue;
      } 
const filteredItems = items.filter(i => i.itemCode && i.itemCode !=="0");
if (!filteredItems.length) {
  console.log(`⚠️ כל הפריטים בקובץ ${fileName} לא חוקיים (itemCode חסר או 0), מדלגת`);
  continue;
}
   // שלב חדש: לבדוק אילו פריטים כבר קיימים
// const existingItemCodesSet = new Set<number>();

// const { data: existingItems, error: existingItemsError } = await (itemRepo as any)['supabase']
//   .from('item')
//   .select('item_code')
//   .in('item_code', filteredItems.map(i => i.itemCode));

// if (existingItemsError) {
//   throw new Error(`שגיאה בבדיקת פריטים קיימים: ${existingItemsError.message}`);
// }

// if (existingItems) {
//   existingItems.forEach((row: { item_code: number })  => existingItemCodesSet.add(row.item_code));
// }
const supabaseClient = (itemRepo as any)['supabase'];
const existingItemCodesSet = await getExistingItemCodesInBatches(
  supabaseClient,
  filteredItems.map(i => i.itemCode),
  100
);

// חלוקה לפריטים לעדכון ופריטים להכנסה חדשה
const toUpdate = filteredItems.filter(i => existingItemCodesSet.has(i.itemCode));
const toInsert = filteredItems.filter(i => !existingItemCodesSet.has(i.itemCode));

if (toUpdate.length > 0) {
  console.log(`📝 מעדכנת ${toUpdate.length} פריטים קיימים ב-Supabase`);
await updateItemsInBatches(itemRepo, toUpdate, 500);
  console.log(`✅ ${toUpdate.length} פריטים עודכנו בהצלחה`);
}
 else {
  console.log("ℹ️ אין פריטים לעדכן");
}
if (toInsert.length > 0) {
  const inserted = await addItemsInBatches(itemRepo, toInsert, 100);
  console.log(`✅ נוספו ${inserted.length} פריטים מתוך הקובץ: ${fileName}`);
} 
else {
  console.log(`ℹ️ אין פריטים חדשים להוספה מתוך הקובץ: ${fileName}`);
}
    } catch (err) {
      console.error(`❌ שגיאה בהוספת פריטים מקובץ ${fileName}:`, err);
    }
  }
 }
//מחזירה את שמות הקבצים מתוך ה־FTP
export async function getFileNames(): Promise<{ client: Client; fileNames: string[] }> {
    const { client, files } = await connectAndListFiles();
    const fileNames = files.filter(f => f.isFile).map(f => f.name);
    return { client, fileNames };
}
//מורידה קובץ מה-FTP לתיקייה מקומית
export async function downloadFile(client: Client, fileName: string, localDir: string): Promise<void> {

    const localPath = path.join(localDir, fileName);
    await client.downloadTo(localPath, fileName);
}

export async function updateDailyForData() {
    let fileStoreName = ""
    try {
        let { client, fileNames } = await getFileNames()
        const success = await getMostUpdateStoresFile(fileNames)
        if (success) { fileStoreName = success }
        const localDir = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/DownloadsStoreFile";
        await downloadFile(client, fileStoreName, localDir)
        const fileTParse = await fs.readdir(localDir);
        const parseAllChain = await parseStoresXmlFileToStores(localDir + '/' + fileTParse[0]);//שליחתת כל התוכן לפנוקמיה הממירה לאוביקט את קובץ החנויות לאובייקטים של סניפים
        console.log(JSON.stringify(parseAllChain, null, 2));
        const folderPathForPriceFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy";
       const folderPathForPromotionFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevy";
        if (parseAllChain) {
            let allChain: Store[] = parseAllChain//בניית עצם מסוג סניף שיחזיק את מה שחזר מפונקצית ההמרה
            let allPriceFullForChain: string[] = []
            let allPromotionForChain: string[] = []
            let dictionaryPrices = new Map<string, Price[]>();
            let dictionaryItem = new Map<string, Item[]>();
            let dictionaryPromotion = new Map<string, Promotion[]>()
            let storeID2 = ""
            let storeID1 = ""
            for (let i of allChain) {
                if (i.storeId < 10) {
                    storeID2 = "00" + String(i.storeId)
                }
                else if (i.storeId > 10 && i.storeId < 100) {
                    storeID2 = "0" + String(i.storeId)
                }
                else {
                    storeID2 = String(i.storeId)
                }
                const result = await getMostUpdate(fileNames, storeID2);
                if (result) {
                    allPriceFullForChain.push(result)
                }

            }
            for (let i of allPriceFullForChain) {
                await downloadFileWithZip(client, i, folderPathForPriceFIleXml)
            }
            for (let i of allChain) {
                if (i.storeId < 10) {
                    storeID1 = "00" + String(i.storeId)
                }
                else if (i.storeId > 10 && i.storeId < 100) {
                    storeID1 = "0" + String(i.storeId)
                }
                else {
                    storeID1 = String(i.storeId)
                }
                const result2 = await ReturnsTheMostUpToDatePromotionsFile(fileNames, storeID1);
                if (result2) {
                    allPromotionForChain.push(result2)
                }
            }
            for (let i of allPromotionForChain) {
                await downloadFileWithZip(client, i, folderPathForPromotionFIleXml)
            }
            const filePriceNames = await fs.readdir(folderPathForPriceFIleXml);
            for (const fileName of filePriceNames) {
                const filePath = path.join(folderPathForPriceFIleXml, fileName);
                dictionaryItem.set(fileName, await parsePriceFullXmlToItemJson(filePath))
                dictionaryPrices.set(fileName, await parsePriceFullXmlToPriceJson(filePath))
            }
            const filePromotionNames = await fs.readdir(folderPathForPromotionFIleXml);
            for (const fileName of filePromotionNames) {
                const filePath = path.join(folderPathForPromotionFIleXml, fileName);
                const buffer = await fs.readFile(filePath);
                const xmlText = buffer.toString('utf8');
                dictionaryPromotion.set(fileName, await parseXmlPromotionsToJson(xmlText))
            }
            console.log(dictionaryPrices);
            console.log(dictionaryPromotion);
            console.log(dictionaryItem);
             // שמירה לבסיס הנתונים
    const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_ANON_KEY!);
      const itemRepo = new ItemRepository(supabase);
       await saveAllItemsToDb(dictionaryItem, itemRepo);

   console.log("✅ טעינת קבצי פריטים הסתיימה בהצלחה");
 }
    else {
            console.error(":x: לא התקבל אובייקט תקין מה־XML");
        }
   } catch (e) {
    console.error("❌ שגיאה בהרצת updateDailyForData:", e);
    throw e; 
 }
    }

export async function testItemsFromLocalFilesOnly() {
  try {
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.log("SUPABASE_KEY:", process.env.SUPABASE_ANON_KEY);

    const folderPathForPriceFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy";

    const filePriceNames = await fs.readdir(folderPathForPriceFIleXml);

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const itemRepo = new ItemRepository(supabase);
const priceRepo = new PriceRepository(supabase);

    for (const fileName of filePriceNames) {
      console.log(`📥 מתחילה קריאה לקובץ: ${fileName}`);

      const filePath = path.join(folderPathForPriceFIleXml, fileName);

      console.log(`🧠 קוראת פריטים מתוך הקובץ: ${fileName}`);
      const items = await parsePriceFullXmlToItemJson(filePath);

      console.log(`💸 קוראת מחירים מתוך הקובץ: ${fileName}`);
      const prices = await parsePriceFullXmlToPriceJson(filePath);

      // **שומרת פריטים למסד נתונים מיד - לא אוגרת את הכל בזיכרון**
      // await saveAllItemsToDb(new Map([[fileName, items]]), itemRepo);
      await saveAllPricesToDb(new Map([[fileName, prices]]), priceRepo);

      console.log(`✅ סיימה להמיר ולשמור את הקובץ: ${fileName}`);
    }

    console.log("✅ טעינת קבצי פריטים מהדיסק הסתיימה בהצלחה");
  } catch (e) {
    console.error("❌ שגיאה בהרצת testItemsFromLocalFilesOnly:", e);
    throw e;
  }
}

// cron.schedule('0 8 * * *', () => {
//     console.log(':date: מריץ את הפונקציה היומית שלך עכשיו');
//     updateDailyForData();
// });

