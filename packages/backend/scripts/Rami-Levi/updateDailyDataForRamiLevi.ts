import { parseStoresXmlFileToStores } from "./parseXmlStoreToJson";
import fspromises from 'fs/promises';
import fs from 'fs';
import { Item } from '@smartcart/shared/src/item';
import getMostUpdate from "./getMostUpdate";
import { ReturnsTheMostUpToDatePromotionsFile } from "./LastFilePromotions";
import { Store } from "@smartcart/shared";
import { parseXmlPromotionsToJson, parseXmlToJson } from "./convertXMLPromotionFileToJson";
import cron from 'node-cron';
import getMostUpdateStoresFile from "./getMostUpdateStoresFile";
import * as path from "path";
import { Client } from "basic-ftp";
import { connectAndListFiles } from "./connect-rami-levi";
import { downloadFileWithZip } from "./downloadFile";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { parsePriceFullXmlToItemJson } from "./parsePriceFullXmlToItemJson";
import { Price } from "@smartcart/shared";
import { parsePriceFullXmlToPriceJson } from "./parsePriceFullXmlToPriceJson";
import { Promotion } from "@smartcart/shared";
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import dotenv from 'dotenv';
import { PriceRepository } from "../../src/db/Repositories/priceRepository";
import zlib from 'zlib';
import { PromotionRepository } from "../../src/db/Repositories/promotionRepository";
dotenv.config();

/**
 * מחלץ קובץ GZ שמכיל XML, ושומר את הקובץ החדש באותו תיק
 * @param filePath הנתיב המלא לקובץ הדחוס
 * @returns נתיב הקובץ המחולץ
 */
export async function ExtractXMLFromZIP(filePath: string): Promise<string | null> {
  try {
    await fs.promises.access(filePath);

    const ext = path.extname(filePath);
    if (ext !== ".gz") {
      throw new Error(`File is not a GZ archive: ${filePath}`);
    }

    const dir = path.dirname(filePath);
    const base = path.basename(filePath, ".gz");
    const extractedPath = path.join(dir, base);

    const buffer = await fs.promises.readFile(filePath);

    // בדיקה שהקובץ לא ריק
    if (buffer.length === 0) {
      console.warn(`⚠️ הקובץ ריק: ${filePath}`);
      return null;
    }

    let decompressed: Buffer;
    try {
      decompressed = await new Promise<Buffer>((resolve, reject) =>
        zlib.gunzip(buffer, (err, res) => (err ? reject(err) : resolve(res)))
      );
    } catch (e) {
      console.warn(`⚠️ הקובץ פגום או לא תקין: ${filePath}`, e);
      return null; // מדלגים
    }

    await fs.promises.writeFile(extractedPath, decompressed);
    await fs.promises.unlink(filePath);
    return extractedPath;
  } catch (err) {
    console.error(`❌ שגיאה בחילוץ ${filePath}:`, err);
    return null;
  }
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
        const upserted = await priceRepo.updateManyPrices(uniqueBatch);
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
  const BUFFER_SIZE = 5000; // גודל הבאפר – אפשר לשנות לפי זיכרון וזמן ריצה

  await clearFolder("D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevy");
  await clearFolder("D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy");
  await clearFolder("D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/DownloadsStoreFile");

  let fileStoreName = "";
  try {
    let { client, fileNames } = await getFileNames();
    const success = await getMostUpdateStoresFile(fileNames);
    if (success) {
      fileStoreName = success;
    }
    const localDir = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/DownloadsStoreFile";
    await downloadFile(client, fileStoreName, localDir);

    const fileTParse = await fspromises.readdir(localDir);
    const parseAllChain = await parseStoresXmlFileToStores(localDir + "/" + fileTParse[0]);
    console.log(JSON.stringify(parseAllChain, null, 2));

    const folderPathForPriceFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy";
    const folderPathForPromotionFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevy";

    if (!parseAllChain) {
      console.error(":x: לא התקבל אובייקט תקין מה־XML");
      return;
    }

    let allChain: Store[] = parseAllChain;
    let allPriceFullForChain: string[] = [];
    let allPromotionForChain: string[] = [];

    // הורדת קבצים לכל רשת
    for (const i of allChain) {
      let storeID = "";
      if (i.storeId < 10) storeID = "00" + i.storeId;
      else if (i.storeId < 100) storeID = "0" + i.storeId;
      else storeID = String(i.storeId);

      const priceFileName = await getMostUpdate(fileNames, storeID);
      if (priceFileName) {
        allPriceFullForChain.push(priceFileName);
      }
    }

    for (const priceFile of allPriceFullForChain) {
      await downloadFileWithZip(client, priceFile, folderPathForPriceFIleXml);
    }

 // חילוץ קבצים דחוסים במקביל
const priceFiles = await fspromises.readdir(folderPathForPriceFIleXml);
const extractTasks = priceFiles
  .filter(file => file.endsWith(".gz"))
  .map(async (file) => {
    const fullPath = path.join(folderPathForPriceFIleXml, file);
    try {
      const extracted = await ExtractXMLFromZIP(fullPath);
      if (!extracted) {
        console.warn(`⚠️ ${file} פגום/ריק – נמחק`);
        await fspromises.unlink(fullPath); // מחיקת קובץ פגום
      }
    } catch (e) {
      console.error(`❌ שגיאה בחילוץ ${file}:`, e);
      await fspromises.unlink(fullPath); // גם במקרה של שגיאה מוחקים
    }
  });

await Promise.all(extractTasks); // מחכים שכל החילוצים יסתיימו


    for (const i of allChain) {
      let storeID = "";
      if (i.storeId < 10) storeID = "00" + i.storeId;
      else if (i.storeId < 100) storeID = "0" + i.storeId;
      else storeID = String(i.storeId);

      const promoFileName = await ReturnsTheMostUpToDatePromotionsFile(fileNames, storeID);
      if (promoFileName) {
        allPromotionForChain.push(promoFileName);
      }
    }

    for (const promoFile of allPromotionForChain) {
      await downloadFileWithZip(client, promoFile, folderPathForPromotionFIleXml);
    }

    // יצירת לקוח Supabase ורפוזיטוריות
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const itemRepo = new ItemRepository(supabase);
    const priceRepo = new PriceRepository(supabase);
    const promotionRepo = new PromotionRepository(supabase);

    // באפרים לאיסוף הנתונים
    let itemsBuffer: Item[] = [];
    let pricesBuffer: Price[] = [];
    let promotionsBuffer: Promotion[] = [];

    // עיבוד קבצי פריטים ומחירים עם באפר
    const filePriceNames = await fspromises.readdir(folderPathForPriceFIleXml);
    for (const fileName of filePriceNames) {
      const filePath = path.join(folderPathForPriceFIleXml, fileName);

      let items: Item[] = [];
      let prices: Price[] = [];

      try {
        items = await parsePriceFullXmlToItemJson(filePath);
      } catch (err: any) {
        console.warn(`⚠️ דילוג – לא נמצאו פריטים בקובץ ${fileName}:`, err.message);
        continue;
      }

      try {
        prices = await parsePriceFullXmlToPriceJson(filePath);
      } catch (err: any) {
        console.warn(`⚠️ דילוג – שגיאה בפענוח מחירים בקובץ ${fileName}:`, err.message);
        continue;
      }

      itemsBuffer.push(...items);
      pricesBuffer.push(...prices);

      if (itemsBuffer.length >= BUFFER_SIZE) {
        await saveAllItemsToDb(new Map([["buffer-batch", itemsBuffer]]), itemRepo);
        itemsBuffer = [];
      }
      if (pricesBuffer.length >= BUFFER_SIZE) {
        await saveAllPricesToDb(new Map([["buffer-batch", pricesBuffer]]), priceRepo);
        pricesBuffer = [];
      }
    }

    // שמירת מה שנשאר בבאפר
    if (itemsBuffer.length) {
      await saveAllItemsToDb(new Map([["last-batch", itemsBuffer]]), itemRepo);
    }
    if (pricesBuffer.length) {
      await saveAllPricesToDb(new Map([["last-batch", pricesBuffer]]), priceRepo);
    }

    // עיבוד קבצי מבצעים עם באפר
    const filePromotionNames = await fspromises.readdir(folderPathForPromotionFIleXml);
    for (const fileName of filePromotionNames) {
      const filePath = path.join(folderPathForPromotionFIleXml, fileName);
      const buffer = await fspromises.readFile(filePath);
      const xmlText = buffer.toString("utf8");
      let promotions = await parseXmlPromotionsToJson(xmlText);

      // סינון מבצעים עם פריטים קיימים בלבד
      promotions = await filterPromotionsWithOnlyExistingItems(supabase, promotions);

      promotionsBuffer.push(...promotions);

      if (promotionsBuffer.length >= BUFFER_SIZE) {
        await saveAllPromotionsToDb(new Map([["buffer-batch", promotionsBuffer]]), promotionRepo, supabase);
        promotionsBuffer = [];
      }
    }

    // שמירת מבצעים אחרונים שנותרו בבאפר
    if (promotionsBuffer.length) {
      await saveAllPromotionsToDb(new Map([["last-batch", promotionsBuffer]]), promotionRepo, supabase);
    }

    console.log("✅ עדכון יומי הסתיים בהצלחה");
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
    const folderPathForPromotionFIleXml = "D:/פרקטיקום/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevy";
    const filePriceNames = await fspromises.readdir(folderPathForPriceFIleXml);
    const filePromotionNames = await fspromises.readdir(folderPathForPromotionFIleXml);

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    const itemRepo = new ItemRepository(supabase);
    const priceRepo = new PriceRepository(supabase);
    const promotionRepo = new PromotionRepository(supabase);

    for (const fileName of filePriceNames) {
      console.log(`📥 מתחילה קריאה לקובץ: ${fileName}`);
      const filePath = path.join(folderPathForPriceFIleXml, fileName);
      console.log(`🧠 קוראת פריטים מתוך הקובץ: ${fileName}`);
      const items = await parsePriceFullXmlToItemJson(filePath);
      console.log(`💸 קוראת מחירים מתוך הקובץ: ${fileName}`);
      const prices = await parsePriceFullXmlToPriceJson(filePath);

      //שומרת פריטים למסד נתונים מיד - לא אוגרת את הכל בזיכרון
      await saveAllItemsToDb(new Map([[fileName, items]]), itemRepo);
      await saveAllPricesToDb(new Map([[fileName, prices]]), priceRepo);

      console.log(`✅ סיימה להמיר ולשמור את הקובץ: ${fileName}`);
    }
    for (const fileName of filePromotionNames) {
      console.log(`📥 מתחילה קריאה לקובץ מבצעים: ${fileName}`);
      const filePathP = path.join(folderPathForPromotionFIleXml, fileName);
      const buffer = await fspromises.readFile(filePathP);
      const xmlText = buffer.toString('utf8');
      const promotions = await parseXmlPromotionsToJson(xmlText);

      //  משתמשים בפונקציה שמחזירה רק את המבצעים תקינים
      const filteredPromotions = await filterPromotionsWithOnlyExistingItems(supabase, promotions);
      if (filteredPromotions.length < promotions.length) {
        console.warn(`⚠️ נמצאו מבצעים לא תקפים (חסרים פריטים) בקובץ ${fileName}, ${promotions.length - filteredPromotions.length} מבצעים נדחו`);
      }
      await saveAllPromotionsToDb(new Map([[fileName, filteredPromotions]]), promotionRepo, supabase);
      console.log(`✅ סיימה להמיר ולשמור את קובץ המבצעים: ${fileName}`);
    }
    console.log("✅ טעינת קבצי פריטים מהדיסק הסתיימה בהצלחה");

  } catch (e) {
    console.error("❌ שגיאה בהרצת testItemsFromLocalFilesOnly:", e);
    throw e;
  }
}

cron.schedule('0 8 * * *', () => {
    console.log(':date: מריץ את הפונקציה היומית שלך עכשיו');
    updateDailyForData();
});
