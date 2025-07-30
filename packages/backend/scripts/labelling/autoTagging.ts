import 'dotenv/config';
import { supabase } from "../../src/services/supabase";
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import tagProductsByGPT from './productLabellingByAI';
import { logToFile } from './logger';

function log(message: string) {
  logToFile(`[autoTagNewTags] ${message}`);
}

export async function autoTagNewTags(): Promise<string> {
  log("Starting auto-tagging process.");

  const itemRepository = new ItemRepository(supabase);
  const tagRepository = new TagRepository(supabase);

  const allTags = await tagRepository.getAllTags() || [];
  const allItems = await itemRepository.getAllItems() || [];

  const taggedNow = new Set<string>();
  const unscannedTags = allTags.filter(t => !t.isAlreadyScanned);
  log(`Found ${unscannedTags.length} unscanned tags.`);

  for (const tag of unscannedTags) {
    log(`Processing tag "${tag.tagName}" (ID: ${tag.tagId})`);

    let similarByName: any[] = [];

    const taggedItem = tag.tagId !== undefined
      ? allItems.find(item => item?.tagsId?.includes(tag.tagId!))
      : undefined;

    if (taggedItem) {
      similarByName = await itemRepository.fuzzySearchItemsByText(taggedItem.itemName);
    }

    const similarByTagName = await itemRepository.fuzzySearchItemsByText(tag.tagName);
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

  const instructions = `
Your goal: Tag each product using only the provided list of tags, without creating any new tags.

Instructions:
- Use only tags from the provided list.
- Do not invent or create any new tags.
- Only tag based on information explicitly stated in the product name.
- Do not assume properties such as “vegan”, “organic”, “diet”, etc., unless they are mentioned.
- Use exact tag wording from the list without modification.

---

Strict formatting rules:
- Each output line must follow this format exactly:  
ספריי לשיער חזק מאוד: טואלטיקה והיגיינה,טיפוח;
- Separate each line with a semicolon (;)
- Do not include any numbers, bullets, or list formatting
- Do not use quotation marks, parentheses, or any special characters
- Do not add explanations or additional text before or after
- Do not add a period at the end of any line — only end with a semicolon

---

Example:
ספריי לשיער חזק מאוד: טואלטיקה והיגיינה,טיפוח;


`;

  const untaggedItems = allItems.filter(item => !taggedNow.has(String(item.itemCode)));
  log(`Remaining untagged items: ${untaggedItems.length}`);

  let finalResult = "";
  for (let i = 0; i < untaggedItems.length; i += 100) {
    const batch = untaggedItems.slice(i, i + 100);
    const productNames = batch.map(item => item.itemName);
    log(`Sending batch ${i / 100 + 1} to GPT (${batch.length} items)`);

    const resultString = await tagProductsByGPT(
      productNames,
      allTags.map(tag => tag.tagName),
      instructions
    );

    finalResult += resultString + "\n";
  }

  log("Auto-tagging process completed.");
  return finalResult.trim();
}
