import 'dotenv/config';
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import { supabase } from "../../src/services/supabase";
import { logToFile } from './logger';

export async function parseAndSaveTagsFromResponse(response: string): Promise<void> {
  if (response === '') {
    logToFile("Empty response received, skipping save processing.");
    return;
  }

  const lines = response
    .split(";")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    logToFile("No lines found in response for processing.");
    return;
  }

  const itemRepository = new ItemRepository(supabase);
  const tagRepository = new TagRepository(supabase);

  const allTags = await tagRepository.getAllTags() || [];
  const allItems = await itemRepository.getAllItems() || [];

  const tagNameToIdMap = new Map(allTags.map(tag => [tag.tagName, tag.tagId]));

  const summary = {
    totalLines: lines.length,
    itemsUpdated: 0,
    newTagsCreated: 0,
    itemsSkipped: 0,
  };

  for (const line of lines) {
    const [product, tagsStr] = line.split(":").map(part => part.trim());
    const tags = tagsStr ? tagsStr.split(",").map(tag => tag.trim()) : [];

    const item = allItems.find(i => i.itemName === product);
    if (!item) {
      summary.itemsSkipped++;
      continue;
    }

    const tagIds: number[] = [];

    for (const tag of tags) {
      const isNew = tag.endsWith("*");
      const cleanTag = isNew ? tag.slice(0, -1).trim() : tag;

      let tagId = tagNameToIdMap.get(cleanTag);

      if (!tagId) {
        const newTag = await tagRepository.addTag(cleanTag);
        tagId = newTag.tagId;
        tagNameToIdMap.set(cleanTag, Number(tagId));
        summary.newTagsCreated++;
      }

      tagIds.push(Number(tagId));
    }

    item.tagsId = tagIds;
    await itemRepository.updateItem(item);
    summary.itemsUpdated++;
  }

  logToFile(`Tag processing completed. Summary: 
  - Total lines processed: ${summary.totalLines}
  - Items updated: ${summary.itemsUpdated}
  - New tags created: ${summary.newTagsCreated}
  - Items skipped: ${summary.itemsSkipped}`);
}
