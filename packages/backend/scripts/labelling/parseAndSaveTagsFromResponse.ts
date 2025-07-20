import 'dotenv/config';
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import { supabase } from "../../src/services/supabase";
import { logToFile } from './logger';

export async function parseAndSaveTagsFromResponse(response: string): Promise<void> {
  if (response === ''){
    logToFile("the response that was accept is empty💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛");
    return;
  }
  logToFile("🚀 [parseAndSaveTagsFromResponse] התחלת עיבוד תגיות מהמחרוזת💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛");

  const lines = response
    .split(";")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  logToFile(`🔍 [parseAndSaveTagsFromResponse] נמצאו ${lines.length} שורות לעיבוד💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);

  const itemRepository = new ItemRepository(supabase);
  const tagRepository = new TagRepository(supabase);

  logToFile("[parseAndSaveTagsFromResponse] קורא את כל התגיות מהמאגר💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛");
  const allTags = await tagRepository.getAllTags() || [];
  logToFile(`[parseAndSaveTagsFromResponse] סך התגיות: ${allTags.length}💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);

  logToFile("[parseAndSaveTagsFromResponse] קורא את כל המוצרים מהמאגר💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛");
  const allItems = await itemRepository.getAllItems() || [];
  logToFile(`[parseAndSaveTagsFromResponse] סך המוצרים: ${allItems.length}💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);

  const tagNameToIdMap = new Map(allTags.map(tag => [tag.tagName, tag.tagId]));

  for (const [index, line] of lines.entries()) {
    logToFile(`📦 [parseAndSaveTagsFromResponse] טיפול בשורה #${index + 1}: "${line}"💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
    const [product, tagsStr] = line.split(":").map(part => part.trim());
    const tags = tagsStr ? tagsStr.split(",").map(tag => tag.trim()) : [];

    logToFile(`  -> [parseAndSaveTagsFromResponse] מוצר: "${product}", תגיות שמגיעות: [${tags.join(", ")}]💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);

    const item = allItems.find(i => i.itemName === product);
    if (!item) {
      logToFile(`⚠️ [parseAndSaveTagsFromResponse] מוצר לא נמצא במאגר: "${product}" - מדלגים לשורה הבאה💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
      continue;
    }

    const tagIds: number[] = [];

    for (const tag of tags) {
      const isNew = tag.endsWith("*");
      const cleanTag = isNew ? tag.slice(0, -1).trim() : tag;

      logToFile(`   ↪️ [parseAndSaveTagsFromResponse] טיפול בתג: "${tag}" (נקה ל-"${cleanTag}"), תג חדש? ${isNew}💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);

      let tagId = tagNameToIdMap.get(cleanTag);

      if (!tagId) {
        logToFile(`   🆕 [parseAndSaveTagsFromResponse] מוסיף תג חדש למסד: "${cleanTag}"💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);

        const addTagData = {
          tag_name: cleanTag,
          date_added: new Date(),
          is_already_scanned: false
        };

        const { data: newTag, error } = await supabase
          .from('tag')
          .insert([addTagData])
          .select()
          .single();

        if (error) {
          logToFile(`   ❌ [parseAndSaveTagsFromResponse] שגיאה בהוספת תגית חדשה "${cleanTag}": ${error.message} - מדלגים לתג הבא💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
          continue;
        }

        tagId = newTag.tag_id;
        tagNameToIdMap.set(cleanTag, Number(tagId));

        logToFile(`   ✅ [parseAndSaveTagsFromResponse] תג חדש נוסף עם ID: ${tagId}💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
      } else {
        logToFile(`   ✅ [parseAndSaveTagsFromResponse] תג קיים: "${cleanTag}" עם ID: ${tagId}💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
      }

      tagIds.push(Number(tagId));
    }

    item.tagsId = tagIds;
    logToFile(`  💾 [parseAndSaveTagsFromResponse] מעדכן מוצר "${item.itemName}" עם תגיות: [${tagIds.join(", ")}]💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
    await itemRepository.updateItem(item);
    logToFile(`  ✅ [parseAndSaveTagsFromResponse] מוצר "${item.itemName}" עודכן בהצלחה💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
  }

  logToFile(`🎯 [parseAndSaveTagsFromResponse] סיום עיבוד כל השורות💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);

  const updatedItems = await itemRepository.getAllItems();
  logToFile(`--- [parseAndSaveTagsFromResponse] מצב מוצרים לאחר עדכון ---💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
  updatedItems.forEach(item => {
    logToFile(`    📄 ${item.itemName}: tagsId = [${item.tagsId?.join(", ")}]💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
  });

  logToFile(`✅ [parseAndSaveTagsFromResponse] סיום תהליך עיבוד תגיות בהצלחה💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛`);
}
