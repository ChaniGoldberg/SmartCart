import ItemService from "../../src/services/itemService";
import { tagService } from "../../src/services/tagService";

export async function parseAndSaveTagsFromResponse(response: string): Promise<void> {
  const itemService = new ItemService();
  const lines = response
    .split(";")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const allTags = await tagService.getAllTags() || [];
  const allItems = await itemService.getAllItem() || [];
  const tagNameToIdMap = new Map(allTags.map(tag => [tag.tagName, tag.tagId]));

  for (const line of lines) {
    const [product, tagsStr] = line.split(":").map(part => part.trim());
    const tags = tagsStr ? tagsStr.split(",").map(tag => tag.trim()) : [];

    const item = allItems.find(i => i.itemName === product);
    if (!item) {
      console.warn(`⚠️ מוצר לא נמצא: ${product}`);
      continue;
    }

    const tagIds: number[] = [];

    for (const tagRaw of tags) {
      const isNew = tagRaw.endsWith("*");
      const cleanTag = isNew ? tagRaw.slice(0, -1).trim() : tagRaw;

      let tagId = tagNameToIdMap.get(cleanTag);

      if (!tagId) {
        const newTag = await tagService.addTag(cleanTag);
        tagId = newTag.tagId;
        tagNameToIdMap.set(cleanTag, tagId);
      }

      tagIds.push(tagId);
    }

    item.tagsId = tagIds;
    await itemService.updateItem(item);
    console.log(`✅ עודכן תיוג למוצר: ${item.itemName}`);
  }

  console.log("🎯 כל המוצרים תויגו בהצלחה.");

  // הדפסת כל המוצרים עם התיוגים לאחר העדכון
  const updatedItems = await itemService.getAllItem();
  console.log("\n--- מצב מוצרים לאחר עדכון ---");
  updatedItems.forEach(item => {
    console.log(`${item.itemName}: tagsId = [${item.tagsId?.join(", ")}]`);
  });
}
const response = `
תפוח עץ: פירות, אדום;
בננה: פירות, צהוב*;
מלפפון: ירקות, ירוק*;
`;
// קריאה לפונקציה
parseAndSaveTagsFromResponse(response).then(() => {
  console.log("הפונקציה הסתיימה");
});