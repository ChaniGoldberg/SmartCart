import 'dotenv/config';
import { supabase } from "../../src/services/supabase";
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import tagProductsByGPT from './productLabellingByAI';
import { logToFile } from './logger';

// פונקציה לנרמול אובייקט מוצר לשמות שדות camelCase
const LOG_HEARTS = " 💙💙💙💙💙💙💙💙💙💙💙💙";

function log(message: string) {
  logToFile(`${message}${LOG_HEARTS}`);
}

export async function autoTagNewTags(): Promise<string> {
  log("🚀 התחלת תהליך תיוג אוטומטי");

  const itemRepository = new ItemRepository(supabase);
  const tagRepository = new TagRepository(supabase);

  log("📥 שליפת כל התגיות מהמאגר...");
  const allTags = await tagRepository.getAllTags() || [];
  log(`נשלפו ${allTags.length} תגיות`);

  log("📥 שליפת כל המוצרים מהמאגר...");
  const allItems = await itemRepository.getAllItems() || [];
  log(`נשלפו ${allItems.length} מוצרים`);

  const taggedNow = new Set<string>();
  const unscannedTags = allTags.filter(t => !t.isAlreadyScanned);
  log(`נמצאו ${unscannedTags.length} תגיות שלא סומנו`);

  for (const tag of unscannedTags) {
    log(`🔍 טיפול בתג "${tag.tagName}" (ID: ${tag.tagId})`);
    let similarByName: any[] = [];

    const taggedItem = allItems.find(item => item?.tagsId?.includes(tag.tagId));
    if (taggedItem) {
      log(`➕ נמצא מוצר שמכיל את התג: "${taggedItem.itemName}"`);
      similarByName = await itemRepository.fuzzySearchItemsByText(taggedItem.itemName);
      log(`🔍 נמצאו ${similarByName.length} מוצרים דומים לפי שם מוצר`);
    } else {
      log("⚠️ לא נמצא מוצר שמכיל את התג הזה מראש");
    }

    let similarByTagName = await itemRepository.fuzzySearchItemsByText(tag.tagName);
    log(`🔍 נמצאו ${similarByTagName.length} מוצרים דומים לפי שם תג`);

    const combinedItems = [...similarByName, ...similarByTagName];
    const similarItems = [...new Map(
      combinedItems
        .filter(item => item?.itemCode)
        .map(item => [item.itemCode, item])
    ).values()];
    log(`✅ לאחר סינון כפילויות: ${similarItems.length}  מוצרים ייחודיים לתיוג בעלי שם זהה לתג או למוצר שמכיל את התג`);

    let didTag = false;

    for (const item of similarItems) {
      if (!item.tagsId) item.tagsId = [];

      if (!item.tagsId.includes(tag.tagId)) {
        item.tagsId.push(tag.tagId);

        const updatedItemForDb = {
          ...item,
          tags_id: item.tagsId,
        };

        await itemRepository.updateItem(updatedItemForDb);
        log(`🏷️ תויג "${item.itemName}" (קוד: ${item.itemCode})`);
        taggedNow.add(item.itemCode);
        didTag = true;
      } else {
        log(`⏭️ המוצר "${item.itemName}" כבר מכיל את התג`);
      }
    }

    if (didTag) {
      tag.isAlreadyScanned = true;
      const updatedTagForDb = {
        ...tag,
        is_already_scanned: tag.isAlreadyScanned,
      };
      await tagRepository.updateTag(updatedTagForDb);
      log(`✅ תג "${tag.tagName}" עודכן כ"נסרק"`);
    } else {
      log(`ℹ️ לא נוספו תיוגים חדשים לתג "${tag.tagName}"`);
    }
  }

  const untaggedItems = allItems.filter(item => !taggedNow.has(String(item.itemCode)));
  log(`📦 מספר מוצרים שנותרו ללא תיוג: ${untaggedItems.length}`);

  log(`🧠 שולח מוצרים ללא תיוג ל־GPT...`);
  const resultString = await tagProductsByGPT(untaggedItems, allTags, `
ברשותך רשימת מוצרים ורשימת תיוגים קיימים. עבור כל מוצר, בחר תיוגים רלוונטיים מתוך הרשימה בלבד.
הפלט צריך להיות מחרוזת, כאשר כל שורה בפורמט הבא:
שם מוצר: תיוג 1, תיוג 2
הנחיות:
- כל שורה תופרד באמצעות ;
- אין להוסיף תיוגים חדשים
- אין להוסיף הסברים או טקסטים נוספים
- אין להשתמש בגרשיים, סוגריים או תווים מיוחדים
  `);

  log("🎯 הסתיים תיוג בעזרת GPT");
  return resultString;
}
