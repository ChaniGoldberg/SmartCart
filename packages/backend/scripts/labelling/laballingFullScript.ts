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
        const productNames = items.map(p => p.itemName);

        if (!items || items.length === 0) {
            logToFile("אין מוצרים ללא תיוגים לעיבוד.");
            return
        }

        logToFile(`items fetched: ${items.length} items `);

        const tags: Tag[] | null = await tagRepository.getAllTags();
        if (!tags) {
            logToFile("לא נמצאו תיוגים לעיבוד.🩵🩵🩵🩵");
            return;
        }
        const tagNames = tags.map(t => t?.tagName).filter(Boolean) as string[];

        const instructions: string = `
    
Your goal: Tag each product in a rich, precise, and comprehensive way — covering all possible aspects such as usage, ingredients, category, and context — using a predefined list of tags, and creating new tags when necessary.

Instructions:
- If the existing tag list is insufficient, create new tags and mark them with an asterisk (*) at the end.
- It is better to **over-tag** than to miss a relevant tag.
- Do not hesitate to create new tags.
- Do not guess information that is not explicitly stated in the product name (e.g., “vegan”, “gluten-free”, “diet”).
- Use the **exact wording** of the existing tags without modifying or expanding them.

---

To encourage creation of new tags:
- Always create a new tag (marked with an asterisk *) if you believe a relevant tag does not exist in the predefined list.
- It is better to create many new tags than to miss important aspects of the product.
- If unsure whether a tag exists, assume it does not and mark it as new.
- New tags should be precise and relevant to the product name only.
- Over-tagging is preferred over under-tagging.
- **Do not change or guess tag wording.**

---

**Strict formatting rules:**
- **Each output line must follow this format exactly:**  
ספריי לשיער חזק מאוד: טואלטיקה והיגיינה, מוצרי שיער*, טיפוח*, עיצוב שיער*;

- **Do not add any numbers, bullets, or explanation before or after the lines**
- **Do not return results as a list or numbered lines — just one formatted product per line.**
- When adding new tags, **only write the tag name followed by an asterisk (*), without any extra words like "new tag" or explanations**
- **Do not add a period** at the end of the line; end only with a semicolon (;)**
- **Do not return a period in the end of line in any case**

---

`;
        //Split items into batches of 100
        for (let i = 0; i < items.length; i += 100) {
            const batch = items.slice(i, i + 100);
            const productNames = batch.map(p => p.itemName);

            logToFile(`Processing batch ${i / 100 + 1}: ${productNames.length} items`);

        try {
            const result: string = await tagProductsByGPT(productNames, tagNames, instructions)

            await parseAndSaveTagsFromResponse(result);

        } catch (error: any) {
            console.error("❌ שגיאה בתהליך התיוג:", error);
            logToFile(`❌ שגיאה בתהליך התיוג: ${error.message || error} `);
            throw error;
        }
         }
        await autoTagNewTags();
    } catch (error: any) {
        console.error("❌ שגיאה בתהליך התיוג:", error);
        logToFile(`❌ שגיאה בתהליך התיוג: ${error.message || error} `);
        throw error;
    }
  
}