import 'dotenv/config';
import { ItemRepository } from "../../src/db/Repositories/itemRepository";
import { TagRepository } from "../../src/db/Repositories/tagRepository";
import { supabase } from "../../src/services/supabase";
import { Tag } from "@smartcart/shared/src/tag";


export async function parseAndSaveTagsFromResponse(response: string): Promise<void> {
  console.log("🚀 התחלת עיבוד תגיות מהמחרוזת");

  const lines = response
    .split(";")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  console.log(`🔍 נמצאו ${lines.length} שורות לעיבוד`);

  const itemRepository = new ItemRepository(supabase);
  const tagRepository = new TagRepository(supabase);

  const allTags = await tagRepository.getAllTags() || [];
  const allItems = await itemRepository.getAllItems() || [];

  const tagNameToIdMap = new Map(allTags.map(tag => [tag.tagName, tag.tagId]));

  for (const line of lines) {
    console.log(`\n📦 מטפל בשורה: "${line}"`);
    const [product, tagsStr] = line.split(":").map(part => part.trim());
    const tags = tagsStr ? tagsStr.split(",").map(tag => tag.trim()) : [];

    const item = allItems.find(i => i.itemName === product);
    if (!item) {
      console.warn(`⚠️ מוצר לא נמצא: ${product}`);
      continue;
    }

    const tagIds: number[] = [];

    for (const tag of tags) {
      const isNew = tag.endsWith("*");
      const cleanTag = isNew ? tag.slice(0, -1).trim() : tag;

      let tagId = tagNameToIdMap.get(cleanTag);

      if (!tagId) {
        console.log(`🆕 מוסיף תג חדש: "${cleanTag}"`);
        // const addTag: Tag = {
        //   tagId: 0,
        //   tagName: cleanTag,
        //   dateAdded: new Date(),
        //   isAlreadyScanned: false
        // };
        // const newTag = await tagRepository.addTag(addTag);
///////////////////////////////////////////////////////////////////////////
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
          console.error("❌ שגיאה בהוספת תגית חדשה:", error.message);
          continue;
        }

        tagId = newTag.tag_id;
        tagNameToIdMap.set(cleanTag, Number(tagId));

        /////////////////////////////////////////////
      } else {
        console.log(`✅ תג קיים: "${cleanTag}" (ID: ${tagId})`);
      }
///////////////////////////////////////////////////////
      tagIds.push(Number(tagId));
    }

    item.tagsId = tagIds;
    await itemRepository.updateItem(item);
    console.log(`✅ עודכן תיוג למוצר: ${item.itemName}`);
  }

  console.log("\n🎯 כל המוצרים תויגו בהצלחה.");

  // הדפסת כל המוצרים עם התיוגים לאחר העדכון
  const updatedItems = await itemRepository.getAllItems();
  console.log("\n--- מצב מוצרים לאחר עדכון ---");
  updatedItems.forEach(item => {
    console.log(`${item.itemName}: tagsId = [${item.tagsId?.join(", ")}]`);
  });
}

// // --------------------------------------------------
// // 📌 קריאה לדוגמה לפונקציה עם טקסט תגיות לדוגמה
// const sampleResponse = `
// וופלים עם קרם בטעם מ: ממתקים, חטיפים, וופלים*;
// חמאת בוטנים סקיפי לל: ממרחים, מזון יבש, חמאת בוטנים*;
// מעדן פרי סיינט אמור: מוצרי חלב, פירות טריים, מעדני פרי*;
// `;

// parseAndSaveTagsFromResponse(sampleResponse)
//   .then(() => console.log("\n✅ סיום תהליך עיבוד התגיות"))
//   .catch(err => console.error("❌ שגיאה במהלך עיבוד התגיות:", err));
