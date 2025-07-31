// // פונקציה לקבלת priceCodes קיימים בבאטצ'ים
// // async function getExistingPriceIdsInBatches(
// //   supabase: any,
// //   priceIds: number[],
// //   batchSize = 100
// // ): Promise<Set<number>> {
// //   const existingPriceIdsSet = new Set<number>();

// //   for (let i = 0; i < priceIds.length; i += batchSize) {
// //     const batch = priceIds.slice(i, i + batchSize);

// //     const { data, error } = await supabase
// //       .from('price')
// //       .select('price_id') // ודאי שזה שם השדה בטבלה
// //       .in('price_id', batch);

// //     if (error) {
// //       throw new Error(`שגיאה בבדיקת מחירים קיימים: ${error.message}`);
// //     }

// //     if (data) {
// //       data.forEach((row: { price_id: number }) =>
// //         existingPriceIdsSet.add(row.price_id)
// //       );
// //     }
// //   }

// //   return existingPriceIdsSet;
// // }
// // פונקציה להוספת מחירים ב־batch
// // async function addPricesInBatches(
// //   priceRepository: PriceRepository,
// //   prices: Price[],
// //   batchSize = 100
// // ): Promise<Price[]> {
// //   const allAddedPrices: Price[] = [];
// //   for (let i = 0; i < prices.length; i += batchSize) {
// //     const batch = prices.slice(i, i + batchSize);
// //     const added = await priceRepository.addManyPrices(batch);
// //     allAddedPrices.push(...added);
// //     console.log(`Batch ${i / batchSize + 1} of prices inserted successfully`);
// //   }
// //   return allAddedPrices;
// // }
// // פונקציה לעדכון מחירים ב־batch
// // async function updatePricesInBatches(
// //   priceRepository: PriceRepository,
// //   prices: Price[],
// //   batchSize = 100
// // ): Promise<void> {
// //   for (let i = 0; i < prices.length; i += batchSize) {
// //     const batch = prices.slice(i, i + batchSize);
// //     await priceRepository.updateManyPrices(batch);
// //     console.log(`Batch ${i / batchSize + 1} of prices updated successfully`);
// //   }
// // }

// import { parseStoresXmlFileToStores } from "./parseXmlStoreToJson";
// import fspromises from 'fs/promises';
// import fs from 'fs';
// import { Item } from '@smartcart/shared/src/item';
// import getMostUpdate from "./getMostUpdate";
// import { ReturnsTheMostUpToDatePromotionsFile } from "./LastFilePromotions";
// import { Store } from "@smartcart/shared/src/store";
// import { parseXmlPromotionsToJson, parseXmlToJson } from "./convertXMLPromotionFileToJson";
// import cron from 'node-cron';
// import getMostUpdateStoresFile from "./getMostUpdateStoresFile";
// import * as path from "path";
// import { Client } from "basic-ftp";
// import { connectAndListFiles } from "./connect-rami-levi";
// import { downloadFileWithZip } from "./downloadFile";
// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import { parsePriceFullXmlToItemJson } from "./parsePriceFullXmlToItemJson";
// import { Price } from "@smartcart/shared/src/price";
// import { parsePriceFullXmlToPriceJson } from "./parsePriceFullXmlToPriceJson";
// import { Promotion } from "@smartcart/shared/src/promotion";
// import { ItemRepository } from "../../src/db/Repositories/itemRepository";
// import dotenv from 'dotenv';
// import { PriceRepository } from "../../src/db/Repositories/priceRepository";
// import zlib from 'zlib';
// import { PromotionRepository } from "../../src/db/Repositories/promotionRepository";
// dotenv.config();

// export async function filterPromotionsWithOnlyExistingItems(
//   supabase: SupabaseClient,
//   promotions: Promotion[],
//   batchSize = 500
// ): Promise<Promotion[]> {
//   const allCodes = new Set(promotions.flatMap(p => p.promotionItemsCode));
//   const allCodesArray = Array.from(allCodes);
//   const existingItems: Array<{ item_code: string }> = [];

//   for (let i = 0; i < allCodesArray.length; i += batchSize) {
//     const batch = allCodesArray.slice(i, i + batchSize);
//     const { data, error } = await supabase
//       .from('item')
//       .select('item_code')
//       .in('item_code', batch);

//     if (error) {
//       throw new Error(`Error fetching existing items: ${error.message}`);
//     }
//     existingItems.push(...(data ?? []));
//   }

//   const existingSet = new Set(existingItems.map(i => i.item_code));

//   return promotions.map(p => ({
//     ...p,
//     promotionItemsCode: p.promotionItemsCode.filter(code => existingSet.has(code)),
//   }));
// }





// /**
//  * מחלץ קובץ GZ שמכיל XML, ושומר את הקובץ החדש באותו תיק
//  * @param filePath הנתיב המלא לקובץ הדחוס
//  * @returns נתיב הקובץ המחולץ
//  */
// export function ExtractXMLFromZIP(filePath: string): string {
//   if (!fs.existsSync(filePath)) {
//     throw new Error(`File not found: ${filePath}`);
//   }
//   const ext = path.extname(filePath);
//   if (ext !== '.gz') {
//     throw new Error(`File is not a GZ archive: ${filePath}`);
//   }
//   const dir = path.dirname(filePath);
//   const base = path.basename(filePath, '.gz');
//   const extractedPath = path.join(dir, base);
//   const buffer = fs.readFileSync(filePath);
//   const decompressed = zlib.gunzipSync(buffer);
//   fs.writeFileSync(extractedPath, decompressed);
//   fs.unlinkSync(filePath); // למחוק את הקובץ הדחוס – אם רוצים
//   return extractedPath;
// }
// export async function clearFolder(folderPath: string): Promise<void> {
//   try {
//     await fs.promises.mkdir(folderPath, { recursive: true }); // תוודא שהתיקיה קיימת, ואם לא – תיצור
//     const files = await fs.promises.readdir(folderPath);
//     for (const file of files) {
//       const filePath = path.join(folderPath, file);
//       const stat = await fs.promises.lstat(filePath);
//       if (stat.isFile()) {
//         await fs.promises.unlink(filePath);
//       }
//     }
//   } catch (err) {
//     console.error("❌ שגיאה בניקוי תיקיה:", err);
//     throw err;
//   }
// }


// //סורקת באצים של ובודקת מי מהם כבר קיים במסד נתונים
// // async function getExistingItemCodesInBatches(
// //   supabase: any,
// //   itemCodes: string[],
// //   batchSize = 100
// // ): Promise<Set<string>> {
// //   const existingItemCodesSet = new Set<string>();
// //   for (let i = 0; i < itemCodes.length; i += batchSize) {
// //     const batch = itemCodes.slice(i, i + batchSize);
// //     const { data, error } = await supabase
// //       .from('item')
// //       .select('item_code')
// //       .in('item_code', batch);
// //     if (error) {
// //       throw new Error(`שגיאה בבדיקת פריטים קיימים: ${error.message}`);
// //     }
// //     if (data) {
// //       data.forEach((row: { item_code: string }) => existingItemCodesSet.add(row.item_code));
// //     }
// //   }
// //   return existingItemCodesSet;
// // }
// // מוסיפה את הפריטים למסד הנתונים בקבוצות (Batches) דרך itemRepository, כדי לשפר ביצועים ולמנוע עומס
// // async function addItemsInBatches(
// //   itemRepository: ItemRepository,
// //   items: Item[],
// //   batchSize = 100
// // ): Promise<Item[]> {
// //   const allAddedItems: Item[] = [];
// //   for (let i = 0; i < items.length; i += batchSize) {
// //     const batch = items.slice(i, i + batchSize);
// //     try {
// //       const addedItems = await itemRepository.addManyItems(batch);
// //       allAddedItems.push(...addedItems);
// //       console.log(`Batch ${i / batchSize + 1} inserted successfully`);
// //     } catch (error) {
// //       console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
// //       throw error;
// //     }
// //   }

// //   return allAddedItems;
// // }
// // מעדכנת את הפריטים למסד הנתונים בקבוצות (Batches) דרך itemRepository, כדי לשפר ביצועים ולמנוע עומס
// // async function updateItemsInBatches(
// //   itemRepository: ItemRepository,
// //   items: Item[],
// //   batchSize = 100
// // ): Promise<void> {
// //   for (let i = 0; i < items.length; i += batchSize) {
// //     const batch = items.slice(i, i + batchSize);
// //     try {
// //       await itemRepository.updateManyItems(batch);
// //       console.log(`📝 Batch ${i / batchSize + 1} updated successfully`);
// //     } catch (error) {
// //       console.error(`❌ Error updating batch ${i / batchSize + 1}:`, error);
// //       throw error;
// //     }
// //   }
// // }
// function removeDuplicatePrices(prices: Price[]): Price[] {
//   const seen = new Set<string>();
//   const unique: Price[] = [];

//   for (const p of prices) {
//     const key = `${p.storePK}-${p.itemCode}`;
//     if (!seen.has(key)) {
//       seen.add(key);
//       unique.push(p);
//     }
//   }

//   const duplicatesCount = prices.length - unique.length;
//   if (duplicatesCount > 0) {
//     console.warn(`⚠️ נמצאו ${duplicatesCount} כפילויות בקובץ – הן הוסרו לפני UPSERT`);
//   }

//   return unique;
// }

// export async function saveAllPricesToDb(
//   dictionaryPrices: Map<string, Price[]>,
//   priceRepo: PriceRepository
// ): Promise<void> {
//   const BATCH_SIZE = 100;

//   for (const [fileName, prices] of dictionaryPrices.entries()) {
//     try {
//       if (!prices.length) {
//         console.log(`⚠️ לא נמצאו מחירים בקובץ: ${fileName}`);
//         continue;
//       }

//       console.log(`מעבד ${prices.length} מחירים מהקובץ: ${fileName}`);
//       let totalUpserted = 0;

//       for (let i = 0; i < prices.length; i += BATCH_SIZE) {
//         const batch = prices.slice(i, i + BATCH_SIZE);

//         // ניקוי כפילויות באותו באץ'
//         const uniqueBatch = removeDuplicatePrices(batch);

//         console.log(`UPSERT ${uniqueBatch.length} prices to Supabase`);
//         const upserted = await priceRepo.updateManyPrices(uniqueBatch);

//         totalUpserted += upserted.length;
//         console.log(`✅ נשמרו ${upserted.length} מחירים בבאטצ' ${i / BATCH_SIZE + 1}`);
//       }

//       console.log(`✅ סיום עיבוד קובץ ${fileName}. סה"כ נשמרו ${totalUpserted} מחירים`);
//     } catch (err) {
//       console.error(`❌ שגיאה בשמירת מחירים מקובץ ${fileName}:`, err);
//     }
//   }
// }

// export  function removeDuplicateItems(items: Item[]): Item[] {
//   const map = new Map<string, Item>();
//   for (const item of items) {
//     // נשמור רק את הפריט האחרון שמופיע בקובץ עבור אותו itemCode
//     map.set(item.itemCode, item);
//   }
//   return Array.from(map.values());
// }

// //שומרת פריטים חדשים ומעודכנים מתוך הקבצים למסד נתונים
// export async function saveAllItemsToDb(
//   dictionaryItems: Map<string, Item[]>,
//   itemRepo: ItemRepository
// ): Promise<void> {
//     const BATCH_SIZE = 100;

//   for (const [fileName, items] of dictionaryItems.entries()) {
//     try {
//       if (!items.length) {
//         console.log(`⚠️ לא נמצאו פריטים בקובץ: ${fileName}`);
//         continue;
//       } 
// const filteredItems = items.filter(i => i.itemCode && i.itemCode !=="0");
// if (!filteredItems.length) {
//   console.log(`⚠️ כל הפריטים בקובץ ${fileName} לא חוקיים (itemCode חסר או 0), מדלגת`);
//   continue;
// }
// // ניקוי כפילויות
//       const uniqueItems = removeDuplicateItems(filteredItems);
//       console.log(
//         `📝 מבצעת UPSERT של ${uniqueItems.length} פריטים (לאחר ניקוי כפילויות) מהקובץ ${fileName}`
//       );

//       for (let i = 0; i < uniqueItems.length; i += BATCH_SIZE) {
//         const batch = uniqueItems.slice(i, i + BATCH_SIZE);
//         await itemRepo.upsertManyItems(batch);
//         console.log(`✅ באץ' ${i / BATCH_SIZE + 1} נשמר בהצלחה`);
//       }
//     } catch (err) {
//       console.error(`❌ שגיאה בשמירת פריטים מקובץ ${fileName}:`, err);
//     }
//   }
// }
// //  export async function getExistingPromotionIdsInBatches(
// //   supabase: any,
// //   promotionIds: Number[],
// //   batchSize = 100
// // ): Promise<Set<number>> {
// //   const existingIds = new Set<number>();
// //   for (let i = 0; i < promotionIds.length; i += batchSize) {
// //     const batch = promotionIds.slice(i, i + batchSize);
// //     const { data, error } = await supabase
// //       .from('promotion')
// //       .select('promotion_id')
// //       .in('promotion_id', batch);

// //     if (error) throw new Error(`שגיאה בבדיקת מבצעים קיימים: ${error.message}`);
// //     data?.forEach((row: { promotion_id: number }) => existingIds.add(row.promotion_id));
// //   }
// //   return existingIds;
// // }

//  export async function saveAllPromotionsToDb(
//   promotionMap: Map<string, Promotion[]>,
//   repo: PromotionRepository,
//   supabaseClient: SupabaseClient,
//   batchSize = 100
// ): Promise<void> {
//   for (const [fileName, promotions] of promotionMap.entries()) {
//     if (!promotions.length) {
//       console.log(`⚠️ אין מבצעים בקובץ ${fileName}`);
//       continue;
//     }
//     // חותכים לבאטצ'ים ומבצעים UPSERT ישירות
//     for (let i = 0; i < promotions.length; i += batchSize) {
//       const batch = promotions.slice(i, i + batchSize);
//       try {
//         await repo.upsertManyPromotions(batch);
//         console.log(`UPSERT ${batch.length} מבצעים מקובץ ${fileName} (באטצ' ${i / batchSize + 1})`);
//       } catch (err: any) {
//         console.error(`❌ שגיאה ב-UPSERT מקובץ ${fileName}, באטצ' ${i / batchSize + 1}:`, err.message);
//       }
//     }
//   }
// }



// //מחזירה את שמות הקבצים מתוך ה־FTP
// export async function getFileNames(): Promise<{ client: Client; fileNames: string[] }> {
//     const { client, files } = await connectAndListFiles();
//     const fileNames = files.filter(f => f.isFile).map(f => f.name);
//     return { client, fileNames };
// }
// //מורידה קובץ מה-FTP לתיקייה מקומית
// export async function downloadFile(client: Client, fileName: string, localDir: string): Promise<void> {

//     const localPath = path.join(localDir, fileName);
//     await client.downloadTo(localPath, fileName);
// }

// export async function updateDailyForData() {
//   await clearFolder("D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevy");
// await clearFolder("D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy");
//   await clearFolder("D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/DownloadsStoreFile");
//     let fileStoreName = ""
//     try {
//         let { client, fileNames } = await getFileNames()
//         const success = await getMostUpdateStoresFile(fileNames)
//         if (success) { fileStoreName = success }
//         const localDir = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/DownloadsStoreFile";
//         await downloadFile(client, fileStoreName, localDir)
//         const fileTParse = await fspromises.readdir(localDir);
//         const parseAllChain = await parseStoresXmlFileToStores(localDir + '/' + fileTParse[0]);//שליחתת כל התוכן לפנוקמיה הממירה לאוביקט את קובץ החנויות לאובייקטים של סניפים
//         console.log(JSON.stringify(parseAllChain, null, 2));
//         const folderPathForPriceFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy";
//        const folderPathForPromotionFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevy";
       

//        if (parseAllChain) {
//             let allChain: Store[] = parseAllChain//בניית עצם מסוג סניף שיחזיק את מה שחזר מפונקצית ההמרה
//             let allPriceFullForChain: string[] = []
//             let allPromotionForChain: string[] = []
//             let dictionaryPrices = new Map<string, Price[]>();
//             let dictionaryItem = new Map<string, Item[]>();
//             let dictionaryPromotion = new Map<string, Promotion[]>()
//             let storeID2 = ""
//             let storeID1 = ""
//             for (let i of allChain) {
//                 if (i.storeId < 10) {
//                     storeID2 = "00" + String(i.storeId)
//                 }
//                 else if (i.storeId > 10 && i.storeId < 100) {
//                     storeID2 = "0" + String(i.storeId)
//                 }
//                 else {
//                     storeID2 = String(i.storeId)
//                 }
//                 const result = await getMostUpdate(fileNames, storeID2);
//                 if (result) {
//                     allPriceFullForChain.push(result)
//                 }

//             }
//             for (let i of allPriceFullForChain) {
//                 await downloadFileWithZip(client, i, folderPathForPriceFIleXml)
//             }
//             // חילוץ קבצים דחוסים (אם קיימים) מתוך תקיית המחירים
// const priceFiles = await fspromises.readdir(folderPathForPriceFIleXml);
// for (const file of priceFiles) {
//     const fullPath = path.join(folderPathForPriceFIleXml, file);
//     if (file.endsWith('.gz')) {
//         try {
//             ExtractXMLFromZIP(fullPath);
//         } catch (e) {
//             console.error(`❌ שגיאה בחילוץ ${file}:`, e);
//         }
//     }
// }

//             for (let i of allChain) {
//                 if (i.storeId < 10) {
//                     storeID1 = "00" + String(i.storeId)
//                 }
//                 else if (i.storeId > 10 && i.storeId < 100) {
//                     storeID1 = "0" + String(i.storeId)
//                 }
//                 else {
//                     storeID1 = String(i.storeId)
//                 }
//                 const result2 = await ReturnsTheMostUpToDatePromotionsFile(fileNames, storeID1);
//                 if (result2) {
//                     allPromotionForChain.push(result2)
//                 }
//             }
//             for (let i of allPromotionForChain) {
//                 await downloadFileWithZip(client, i, folderPathForPromotionFIleXml)
//             }
//            const filePriceNames = await fspromises.readdir(folderPathForPriceFIleXml);
// for (const fileName of filePriceNames) {
//     const filePath = path.join(folderPathForPriceFIleXml, fileName);

//     let items: Item[] = [];
//     let prices: Price[] = [];
//     try {
//         items = await parsePriceFullXmlToItemJson(filePath);
//     } catch (err: any) {
//         console.warn(`⚠️ דילוג – לא נמצאו פריטים בקובץ ${fileName}:`, err.message);
//         continue;
//     }

//     try {
//         prices = await parsePriceFullXmlToPriceJson(filePath);
//     } catch (err: any) {
//         console.warn(`⚠️ דילוג – שגיאה בפענוח מחירים בקובץ ${fileName}:`, err.message);
//         continue;
//     }
 

//     dictionaryItem.set(fileName, items);
//     dictionaryPrices.set(fileName, prices);
// }

//             const filePromotionNames = await fspromises.readdir(folderPathForPromotionFIleXml);
//             for (const fileName of filePromotionNames) {
//                 const filePath = path.join(folderPathForPromotionFIleXml, fileName);
//                 const buffer = await fspromises.readFile(filePath);
//                 const xmlText = buffer.toString('utf8');
//                 dictionaryPromotion.set(fileName, await parseXmlPromotionsToJson(xmlText))
//             }
//             console.log(dictionaryPrices);
//             console.log(dictionaryPromotion);
//             console.log(dictionaryItem);
//              // שמירה לבסיס הנתונים
//     const supabase = createClient(
//      process.env.SUPABASE_URL!,
//      process.env.SUPABASE_ANON_KEY!);
//       const itemRepo = new ItemRepository(supabase);
//        await saveAllItemsToDb(dictionaryItem, itemRepo);
//    console.log("✅ טעינת קבצי פריטים הסתיימה בהצלחה");
//    const priceRepo = new PriceRepository(supabase);
// await saveAllPricesToDb(dictionaryPrices, priceRepo);
// console.log("✅ טעינת קבצי מחירים הסתיימה בהצלחה");
//    const promotionRepo = new PromotionRepository(supabase);
// await saveAllPromotionsToDb(dictionaryPromotion, promotionRepo, supabase);
// console.log("✅ טעינת קבצי מבצעים הסתיימה בהצלחה");

//  }
//     else {
//             console.error(":x: לא התקבל אובייקט תקין מה־XML");
//         }
//    } catch (e) {
//     console.error("❌ שגיאה בהרצת updateDailyForData:", e);
//     throw e; 
//  }
//     }

// export async function testItemsFromLocalFilesOnly() {
//   try {
//     console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
//     console.log("SUPABASE_KEY:", process.env.SUPABASE_ANON_KEY);

//     const folderPathForPriceFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy";
//     const folderPathForPromotionFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevy";
//     const filePriceNames = await fspromises.readdir(folderPathForPriceFIleXml);
//     const filePromotionNames = await fspromises.readdir(folderPathForPromotionFIleXml);
  
//     const supabase = createClient(
//       process.env.SUPABASE_URL!,
//       process.env.SUPABASE_ANON_KEY!
//     );

//     const itemRepo = new ItemRepository(supabase);
// const priceRepo = new PriceRepository(supabase);
// const promotionRepo = new PromotionRepository(supabase);

// // for (const fileName of filePriceNames) {
// //        console.log(`📥 מתחילה קריאה לקובץ: ${fileName}`);

// //      const filePath = path.join(folderPathForPriceFIleXml, fileName);

// //       console.log(`🧠 קוראת פריטים מתוך הקובץ: ${fileName}`);
    
    
// //     const items = await parsePriceFullXmlToItemJson(filePath);

// //      console.log(`💸 קוראת מחירים מתוך הקובץ: ${fileName}`);
// //      const prices = await parsePriceFullXmlToPriceJson(filePath);
     

// //    //**שומרת פריטים למסד נתונים מיד - לא אוגרת את הכל בזיכרון**
// //      await saveAllItemsToDb(new Map([[fileName, items]]), itemRepo);
// //      await saveAllPricesToDb(new Map([[fileName, prices]]), priceRepo);

// //     console.log(`✅ סיימה להמיר ולשמור את הקובץ: ${fileName}`);
// // }
//   for (const fileName of filePromotionNames) {
//       console.log(`📥 מתחילה קריאה לקובץ מבצעים: ${fileName}`);
//       const filePathP = path.join(folderPathForPromotionFIleXml, fileName);
//       const buffer = await fspromises.readFile(filePathP);
//       const xmlText = buffer.toString('utf8');
//       const promotions = await parseXmlPromotionsToJson(xmlText);

//       // כאן משתמשים בפונקציה שמחזירה רק את המבצעים תקינים
//       const filteredPromotions = await filterPromotionsWithOnlyExistingItems(supabase, promotions);

//       if (filteredPromotions.length < promotions.length) {
//         console.warn(`⚠️ נמצאו מבצעים לא תקפים (חסרים פריטים) בקובץ ${fileName}, ${promotions.length - filteredPromotions.length} מבצעים נדחו`);
//       }

//       await saveAllPromotionsToDb(new Map([[fileName, filteredPromotions]]), promotionRepo, supabase);
//       console.log(`✅ סיימה להמיר ולשמור את קובץ המבצעים: ${fileName}`);
//     }

// console.log("✅ טעינת קבצי פריטים מהדיסק הסתיימה בהצלחה");

//   } catch (e) {4
//     console.error("❌ שגיאה בהרצת testItemsFromLocalFilesOnly:", e);
//     throw e;
//   }
// }

// // cron.schedule('0 8 * * *', () => {
// //     console.log(':date: מריץ את הפונקציה היומית שלך עכשיו');
// //     updateDailyForData();
// // });

