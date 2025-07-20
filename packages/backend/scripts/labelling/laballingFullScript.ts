import dotenv from "dotenv";
dotenv.config();
import { Item } from '@smartcart/shared/src/item';
import { Tag } from '@smartcart/shared/src/tag';
import { tagService } from '../../src/services/tagService';
import tagProductsByGPT from "./productLabellingByAI";
import { parseAndSaveTagsFromResponse } from './parseAndSaveTagsFromResponse';
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import { supabase } from '../../src/services/supabase';
const tagRepository = new TagRepository(supabase);
/**
 * פונקציה שמביאה מוצרים ללא תיוגים, את כל התיוגים, ומעבירה אותם ל־GPT לתיוג
 */
export async function labelItemsWithAI() {
    // שלב 1: קבלת מוצרים ללא תיוגים
    const items: Item[] = await tagService.getItemsWithoutTags();
    if (!items || items.length === 0) {
        // Handle the case where no tags are found (e.g., throw, return, or set to empty array)
        return;
    }
    // שלב 2: קבלת כל התיוגים
    const tags: Tag[] | null = await tagRepository.getAllTags();
    console.log("Tags fetched:", tags);
    if (!tags) {
        // Handle the case where no tags are found (e.g., throw, return, or set to empty array)
        return;
    }
    // ...existing code...
    const instructions: string = `הנך מקבל רשימת מוצרים יחד עם רשימת תיוגים קיימים. לכל מוצר, תאתר תיוגים מתאימים מתוך הרשימה. אם לדעתך יש תיוגים מתאימים נוספים – תוסיף אותם עם כוכבית בסוף (לדוגמה: תיוג חדש*). הפלט צריך להיות מחרוזת, כאשר כל שורה בפורמט:

שם מוצר: שם תיוג 1, שם תיוג 2, תיוג חדש *

- כל שורה מופרדת ב־;
- אל תוסיף הסברים, רק את המחרוזת בפורמט הזה.
- אל תשתמש בגרשיים או סוגריים.
- חשוב: אם אין תיוג רלוונטי מתוך הרשימה, תוכל להשתמש רק בתיוגים חדשים (מסומנים בכוכבית).
`;

    const result: string = await tagProductsByGPT(items, tags, instructions);
    return result;
    // await parseAndSaveTagsFromResponse(result);
}