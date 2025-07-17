import 'dotenv/config';
import { supabase } from "../../src/services/supabase";
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import tagProductsByGPT from './productLabellingByAI';

// פונקציה לנרמול אובייקט מוצר לשמות שדות camelCase
function normalizeItem(item: any) {
    return {
        ...item,
        itemCode: item.item_code,
        itemId: item.item_id,
        itemType: item.item_type,
        itemName: item.item_name,
        correctItemName: item.correct_item_name,
        manufacturerName: item.manufacturer_name,
        manufactureCountry: item.manufacture_country,
        manufacturerItemDescription: item.manufacturer_item_description,
        itemStatus: item.item_status,
        tagsId: item.tags_id || item.tagsId || [],
    };
}

// פונקציה לנרמול אובייקט תגית לשמות camelCase
function normalizeTag(tag: any) {
    return {
        ...tag,
        tagId: tag.tag_id,
        tagName: tag.tag_name,
        isAlreadyScanned: tag.is_already_scanned,
    };
}

export async function autoTagNewTags(): Promise<string> {
    const itemRepository = new ItemRepository(supabase);
    const tagRepository = new TagRepository(supabase);

    const allTagsRaw = await tagRepository.getAllTags() || [];
    const allTags = allTagsRaw.map(normalizeTag);

    const allItemsRaw = await itemRepository.getAllItems() || [];
    const allItems = allItemsRaw.map(normalizeItem);

    const taggedNow = new Set<string>();
    const unscannedTags = allTags.filter(t => !t.isAlreadyScanned);

    for (const tag of unscannedTags) {
        let similarByName: any[] = [];
        const taggedItem = allItems.find(item => item.tagsId.includes(tag.tagId));
        if (taggedItem) {
            similarByName = await itemRepository.fuzzySearchItemsByText(taggedItem.itemName);
            similarByName = similarByName.map(normalizeItem);
        }

        let similarByTagName = await itemRepository.fuzzySearchItemsByText(tag.tagName);
        similarByTagName = similarByTagName.map(normalizeItem);

        const combinedItems = [...similarByName, ...similarByTagName];
        const similarItems = [...new Map(
            combinedItems
                .filter(item => item?.itemCode)
                .map(item => [item.itemCode, item])
        ).values()];

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
                taggedNow.add(item.itemCode);
                didTag = true;
            }
        }

        if (didTag) {
            tag.isAlreadyScanned = true;
            const updatedTagForDb = {
                ...tag,
                is_already_scanned: tag.isAlreadyScanned,
            };
            await tagRepository.updateTag(updatedTagForDb);
        }
    }
    const untaggedItems = allItems.filter(item => !taggedNow.has(item.itemCode));
    return await tagProductsByGPT(untaggedItems, unscannedTags, `ברשותך רשימת מוצרים ורשימת תיוגים קיימים. עבור כל מוצר, בחר תיוגים רלוונטיים מתוך הרשימה בלבד.

הפלט צריך להיות מחרוזת, כאשר כל שורה בפורמט הבא:

שם מוצר: תיוג 1, תיוג 2

הנחיות:

כל שורה תופרד באמצעות ;

אין להוסיף תיוגים חדשים שאינם מופיעים ברשימת התיוגים

אין להוסיף הסברים, כותרות או טקסטים מיותרים – רק את המחרוזת בפורמט שנדרש

אין להשתמש בגרשיים, סוגריים או תווים מיוחדים`)


}

