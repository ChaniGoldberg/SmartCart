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

    logToFile(`Tags fetched: ${tags.length} tags 🩵🩵🩵🩵`);
    logToFile(`tags fetched: ${tags.map(t => t.tagName).join(", ")} 🩵🩵🩵🩵`);

    const instructions: string = `
הנך מקבל רשימת מוצרים יחד עם רשימת תיוגים קיימים. לכל מוצר, תאתר תיוגים מתאימים מתוך הרשימה.
אם לדעתך יש תיוגים מתאימים נוספים – תוסיף אותם עם כוכבית בסוף (לדוגמה: תיוג חדש*). 
הפלט צריך להיות מחרוזת, כאשר כל שורה בפורמט:
שם מוצר: שם תיוג 1, שם תיוג 2, תיוג חדש *
- כל שורה מופרדת ב־;
- אל תוסיף הסברים, רק את המחרוזת בפורמט הזה.
- אל תשתמש בגרשיים או סוגריים.
- חשוב: אם אין תיוג רלוונטי מתוך הרשימה, תוכל להשתמש רק בתיוגים חדשים (מסומנים בכוכבית).
`;

    const result: string = await tagProductsByGPT(items, tags, instructions);
    logToFile(`tagProductsByGPT result: ${result || 0} 🩵🩵🩵🩵`);
    logToFile(`send the result to parseAndSaveTagsFromResponse 🩵🩵🩵🩵`);

    await parseAndSaveTagsFromResponse(result);
    logToFile(`parseAndSaveTagsFromResponse was called 🩵🩵🩵🩵`);

    logToFile(`autoTagNewTags is calling 🩵🩵🩵🩵`);
    await autoTagNewTags();
    logToFile(`autoTagNewTags finished 🩵🩵🩵🩵`);

    console.log("🚀 תהליך התיוג הושלם בהצלחה 🩵🩵🩵🩵");
    logToFile("🚀 תהליך התיוג הושלם בהצלחה 🩵🩵🩵🩵");
    logToFile(`תוצאה סופית:\n${result}`);

    return result;

  } catch (error: any) {
    console.error("❌ שגיאה בתהליך התיוג:", error);
    logToFile(`❌ שגיאה בתהליך התיוג: ${error.message || error} 🩵🩵🩵🩵`);
    throw error;
  }
}
