import dotenv from "dotenv";
dotenv.config();
import { Item } from '@smartcart/shared/src/item';
import { Tag } from '@smartcart/shared/src/tag';
import tagProductsByGPT from "./productLabellingByAI";
import { parseAndSaveTagsFromResponse } from './parseAndSaveTagsFromResponse';
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import { supabase } from '../../src/services/supabase';
import { autoTagNewTags } from './autoTagging';
import { logToFile } from "./logger";
import { ItemRepository } from "../../src/db/Repositories/itemRepository";

const tagRepository = new TagRepository(supabase);
const itemRepository = new ItemRepository(supabase);



export async function labelItemsWithAI() {
  try {
    const items: Item[] = await itemRepository.getItemsWithoutTags();
    if (!items || items.length === 0) {
      logToFile("אין מוצרים ללא תיוגים לעיבוד.🩵🩵🩵🩵");
      return;
    }

    logToFile(`items fetched: ${items.length} items 🩵🩵🩵🩵`);
    logToFile(`items fetched: ${items.map(t => t.itemName).join(", ")} 🩵🩵🩵🩵`);

    const tags: Tag[] | null = await tagRepository.getAllTags();
    if (!tags) {
      logToFile("לא נמצאו תיוגים לעיבוד.🩵🩵🩵🩵");
      return;
    }
    const tagNames = tags.map(t => t?.tagName).filter(Boolean) as string[];

    const instructions: string = `
מטרתך: לתייג כל מוצר בצורה עשירה, מדויקת ומכסה את כל ההיבטים האפשריים — שימוש, מרכיבים, קטגוריה, קונטקסט — לפי רשימת תיוגים קיימת, ובמידת הצורך גם באמצעות תיוגים חדשים.
- כל מוצר חייב לכלול לפחות **שלושה תיוגים**. אם הרשימה הקיימת לא מספיקה — צור תיוגים חדשים עם כוכבית (*) בסוף. עדיף **לכסות יותר מדי** מאשר להחסיר תיוג רלוונטי.
- אל תחשוש להוסיף תיוג חדש גם אם יש תיוג קרוב או דומה — כל הבדל סמנטי רלוונטי מתקבל.
-  אל תנחש מידע שלא נמצא בשם המוצר (כגון “טבעוני”, “ללא גלוטן”, “דיאט”) אם זה לא נאמר ישירות.
-  השתמש בדיוק במונחים של התיוגים הקיימים, ללא שינוי ניסוח, וללא תוספות טקסט מיותר.
---
פורמט הפלט:
כל שורה כוללת מוצר אחד, ותיראה כך:
שם מוצר: תגית 1, תגית 2, תגית חדשה*, תגית נוספת*, תגית 5;
- כל שורה מסתיימת ב־`; `
- *כל תיוג חדש שאינו ברשימה יקבל כוכבית בסוף: תגית חדשה
---
דוגמה:
ספריי לשיער חזק מאוד: טואלטיקה והיגיינה, מוצרי שיער*, טיפוח*, עיצוב שיער*;
---
 כעת, תייג את המוצרים הבאים:
`;
    // Split items into batches of 100
    for (let i = 0; i < items.length; i += 100) {
      const batch = items.slice(i, i + 100);
      const productNames = batch.map(p => p.itemName);

      logToFile(`Processing batch ${i / 100 + 1}: ${productNames.length} items 🩵🩵🩵🩵`);

      try {
        const result: string = await tagProductsByGPT(productNames, tagNames, instructions);
        logToFile(`tagProductsByGPT result: ${result || 0} 🩵🩵🩵🩵`);
        logToFile(`send the result to parseAndSaveTagsFromResponse 🩵🩵🩵🩵`);

        await parseAndSaveTagsFromResponse(result);
        logToFile(`parseAndSaveTagsFromResponse was called 🩵🩵🩵🩵`);

        console.log("🚀 תהליך התיוג הושלם בהצלחה 🩵🩵🩵🩵");
        logToFile("🚀 תהליך התיוג הושלם בהצלחה 🩵🩵🩵🩵");
        logToFile(`תוצאה סופית:\n${result}`);
      } catch (error: any) {
        console.error("❌ שגיאה בתהליך התיוג:", error);
        logToFile(`❌ שגיאה בתהליך התיוג: ${error.message || error} 🩵🩵🩵🩵`);
        throw error;
      }
    }
  } catch (error: any) {
    console.error("❌ שגיאה בתהליך התיוג:", error);
    logToFile(`❌ שגיאה בתהליך התיוג: ${error.message || error} 🩵🩵🩵🩵`);
    throw error;
  }
  logToFile(`autoTagNewTags is calling 🩵🩵🩵🩵`);
  await autoTagNewTags();
  logToFile(`autoTagNewTags finished 🩵🩵🩵🩵`);
}